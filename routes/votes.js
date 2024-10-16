const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/uploadConfig');
const { render } = require('ejs');


router.post('/init', async (req, res) => {
    const { type } = req.body;

    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Non autorisé' });
    }

    if (!['jury', 'user'].includes(type)) {
        return res.status(400).json({ error: 'Type de session de vote invalide' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [activeSession] = await connection.query('SELECT * FROM voting_sessions WHERE is_active = 1');

        if (activeSession.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Il y a déjà une session de vote en cours' });
        }

        let propositionsQuery = `
            SELECT p.*
            FROM propositions p
            LEFT JOIN proposition_status ps ON p.id = ps.proposition_id
            WHERE 1=1
        `;

        if (type === 'user') {
            propositionsQuery += `
                AND p.retenu = 1
                AND p.statut = 'soldee'
                AND p.id NOT IN (
                    SELECT ps.proposition_id
                    FROM proposition_status ps
                    JOIN voting_sessions vs ON ps.voting_session_id = vs.id
                    WHERE vs.type = 'user'
                )
            `;
        }

        if (type === 'jury') {
            propositionsQuery += `
                AND p.id NOT IN (
                    SELECT ps.proposition_id
                    FROM proposition_status ps
                )
                AND p.statut != 'annulee'
            `;
        }

        const [propositions] = await connection.query(propositionsQuery);

        if (propositions.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Aucune proposition disponible pour le vote' });
        }

        await connection.query('UPDATE propositions SET locked = 1 WHERE id IN (?)', [
            propositions.map(p => p.id),
        ]);

        const [result] = await connection.query(
            'INSERT INTO voting_sessions (type, init_time, is_active) VALUES (?, NOW(), 1)',
            [type]
        );

        const statusInsertPromises = propositions.map(p => {
            return connection.query('INSERT INTO proposition_status (proposition_id, voting_session_id) VALUES (?, ?)', [p.id, result.insertId]);
        });

        await Promise.all(statusInsertPromises);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Session de vote initialisée',
            sessionId: result.insertId,
            propositions,
        });
    } catch (error) {
        await connection.rollback();
        console.log(error);
        res.status(500).json({ error: 'Erreur de base de données', details: error });
    } finally {
        connection.release();
    }
});

router.post('/:sessionId/start', async (req, res) => {
    const { sessionId } = req.params;

    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [sessionResult] = await db.query('UPDATE voting_sessions SET started = 1 WHERE id = ?', [sessionId]);

        if (sessionResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Voting session not found' });
        }

        res.status(200).json({ success: true, message: 'Voting session started, jury can vote now' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.post('/:sessionId/end', async (req, res) => {
    const { sessionId } = req.params;

    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const [sessionResult] = await db.query('UPDATE voting_sessions SET is_active = 0, ended = 1 WHERE id = ?', [sessionId]);
        if (sessionResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Voting session not found' });
        }

        const [propositions] = await db.query(
            `SELECT p.id, p.objet, AVG(v.grade) as avg_grade
            FROM propositions p
            JOIN votes v ON p.id = v.proposition_id
            WHERE v.session_id = ?
            GROUP BY p.id
            HAVING avg_grade > 2.5`,
            [sessionId]
        );

        await db.query('UPDATE propositions SET retenu = 1 WHERE id IN (?)', [
            propositions.map((p) => p.id),
        ]);

        res.json({
            message: 'Voting session closed',
            validatedPropositions: propositions,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.get('/', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    const sessions = await db.query('SELECT * FROM voting_sessions');

    res.render('layouts/main', {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        isJury: req.session.isJury,
        sessions: sessions[0],
        title: 'SESSIONS',
        view: '../voting-sessions/list',
        css: ['tables.css'],
        js: ['ag-grid.js', 'sweet-alert.js']
    });
});


router.delete('/:sessionId', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const [session] = await db.query('SELECT * FROM voting_sessions WHERE id = ?', [req.params.sessionId]);
        if (session.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const [lastSession] = await db.query('SELECT * FROM voting_sessions ORDER BY id DESC LIMIT 1');
        if (lastSession.length === 0 || lastSession[0].id !== session[0].id) {
            return res.status(400).json({ error: 'error', message: 'Only the last created voting session can be deleted' });
        }

        await db.query('DELETE FROM voting_sessions WHERE id = ?', [req.params.sessionId]);

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.get('/proposition-status/:id', async (req, res) => {
    const propositionId = req.params.id;

    try {
        const [propositionStatus] = await db.query(`
            SELECT 
                ps.is_voted, 
                ps.voting_completed,
                ps.average_grade,
                ps.is_validated,
                CASE
                    WHEN ps.proposition_id = (
                        SELECT MIN(proposition_id)
                        FROM proposition_status
                        WHERE voting_completed = 0
                    ) THEN 1
                    ELSE 0
                END AS is_current,
                CASE
                    WHEN ps.proposition_id = (
                        SELECT MAX(proposition_id)
                        FROM proposition_status
                        WHERE voting_completed = 0
                    ) THEN 1
                    ELSE 0
                END AS is_last
            FROM proposition_status ps
            WHERE ps.proposition_id = ?
            LIMIT 1
        `, [propositionId]);

        if (!propositionStatus) {
            return res.status(404).json({ message: 'Proposition non trouvée ou hors de la session de vote actuelle.' });
        }

        res.status(200).json({
            is_voted: propositionStatus[0].is_voted,
            voting_completed: propositionStatus[0].voting_completed,
            is_current: propositionStatus[0].is_current,
            is_last: propositionStatus[0].is_last,
            average_grade: propositionStatus[0].average_grade
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'état de la proposition : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur : ' + error.message });
    }
});

router.get('/current-proposition-id', async (req, res) => {
    try {
        const [proposition] = await db.query(`
            SELECT ps.proposition_id
            FROM proposition_status ps
            JOIN voting_sessions vs ON ps.voting_session_id = vs.id
            WHERE vs.is_active = 1 AND vs.started = 1 AND vs.ended = 0
            AND ps.voting_completed = 0
            ORDER BY ps.proposition_id ASC
            LIMIT 1
        `);

        if (proposition.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition disponible pour le vote.' });
        }

        res.status(200).json({ propositionId: proposition[0].proposition_id });
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'ID de la proposition : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur : ' + error.message });
    }
});

router.get('/current-session/grades', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT ps.proposition_id, ps.average_grade
            FROM proposition_status ps
            JOIN voting_sessions vs ON ps.voting_session_id = vs.id
            WHERE vs.is_active = 1 AND vs.started = 1 AND vs.ended = 0
        `);

        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération des notes des propositions:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

router.get('/current-proposition', async (req, res) => {
    const userId = req.session.userId;
    try {
        const [proposition] = await db.query(`
            SELECT ps.*, p.*, 
                   v.vote_value AS user_vote
            FROM proposition_status ps
            JOIN propositions p ON ps.proposition_id = p.id
            JOIN voting_sessions vs ON ps.voting_session_id = vs.id
            LEFT JOIN votes v ON v.proposition_id = ps.proposition_id AND v.user_id = ?
            WHERE vs.is_active = 1 
              AND vs.started = 1 
              AND vs.ended = 0
              AND ps.voting_completed = 0
            ORDER BY ps.proposition_id ASC
            LIMIT 1
        `, [userId]);

        if (proposition.length === 0) {
            const [lastEndedSession] = await db.query(`
                SELECT id 
                FROM voting_sessions 
                WHERE ended = 1 
                ORDER BY end_time DESC 
                LIMIT 1
            `);

            if (lastEndedSession.length === 0) {
                return res.status(404).json({ message: 'Aucune proposition en cours de vote et aucune session de vote précédente trouvée.' });
            }

            return res.redirect(`/voting-sessions/${lastEndedSession[0].id}`)
        }

        res.render('layouts/main', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,

            title: proposition[0].objet,
            proposition: proposition[0],
            userVote: proposition[0].user_vote,
            css: ['detailProposition.css'],
            js: ['detailProposition.js', 'sweet-alert.js'],
            view: '../jury/proposition'
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de la proposition : ${error.message}`);
        res.status(500).send('Erreur interne du serveur');
    }
});

router.post('/set-voted', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT MIN(proposition_id) AS proposition_id
            FROM proposition_status ps
            JOIN voting_sessions vs ON ps.voting_session_id = vs.id
            WHERE vs.is_active = 1 AND vs.started = 1 AND vs.ended = 0
              AND ps.is_voted = 0 AND ps.voting_completed = 0
        `);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition disponible pour mettre fin au vote.' });
        }

        const propositionId = result[0].proposition_id;

        await db.query(`
            UPDATE proposition_status
            SET is_voted = 1
            WHERE proposition_id = ?
        `, [propositionId]);

        res.status(200).json({ message: 'Le vote a été terminé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la tentative de forcer la fin du vote :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

router.post('/next', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT MIN(proposition_id) AS proposition_id
            FROM proposition_status ps
            JOIN voting_sessions vs ON ps.voting_session_id = vs.id
            WHERE vs.is_active = 1 AND vs.started = 1 AND vs.ended = 0
              AND ps.is_voted = 1 AND ps.voting_completed = 0
        `);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition disponible pour mettre fin au vote.' });
        }

        const propositionId = result[0].proposition_id;

        await db.query(`
            UPDATE proposition_status
            SET voting_completed = 1
            WHERE proposition_id = ?
        `, [propositionId]);

        res.status(200).json({ message: 'Le vote a été terminé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la tentative de forcer la fin du vote :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

router.post('/proposition/:id/vote', upload.none(), async (req, res) => {
    const propositionId = req.params.id;
    const { grade } = req.body;
    const userId = req.session.userId;

    try {
        const isJury = req.session.isJury;

        const [activeSession] = await db.query(`
            SELECT id, type FROM voting_sessions WHERE is_active = 1 AND started = 1 AND ended = 0
        `);

        if (activeSession.length === 0) {
            return res.status(400).json({ error: 'Aucune session de vote active trouvée.' });
        }

        const activeSessionId = activeSession[0].id;
        const sessionType = activeSession[0].session_type;

        if (sessionType === 'jury' && !isJury) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à voter dans cette session.' });
        }

        const [existingVote] = await db.query(`
            SELECT * FROM votes
            WHERE session_id = ? AND proposition_id = ? AND user_id = ?`,
            [activeSessionId, propositionId, userId]
        );

        if (existingVote.length > 0) {
            await db.query(`
                UPDATE votes
                SET vote_value = ?
                WHERE session_id = ? AND proposition_id = ? AND user_id = ?`,
                [grade, activeSessionId, propositionId, userId]
            );

            return res.status(200).json({ message: 'Votre vote a été mis à jour avec succès.' });
        } else {
            await db.query(`
                INSERT INTO votes (session_id, proposition_id, user_id, vote_value)
                VALUES (?, ?, ?, ?)`,
                [activeSessionId, propositionId, userId, grade]
            );

            return res.status(200).json({ message: 'Votre vote a été soumis avec succès.' });
        }

    } catch (error) {
        console.error('Erreur de base de données:', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});


router.get('/statut-vote', function (req, res) {
    res.render('layouts/main', {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        isJury: req.session.isJury,
        title: 'statut',
        css: ['status.css'],
        js: ['status.js'],
        view: '../voting-sessions/status'
    });
});

router.get('/check-active-session', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, type, started, is_active
            FROM voting_sessions
            WHERE is_active = 1 and started = 1
            ORDER BY start_time DESC
            LIMIT 1
        `);

        if (rows.length > 0) {
            const session = rows[0];
            res.json({
                success: true,
                sessionType: session.type,
                sessionStarted: session.started,
            });
        } else {
            res.json({ success: false, message: "No active session found" });
        }
    } catch (error) {
        console.error("Error fetching active session:", error);
        res.status(500).json({ success: false, message: "Error fetching session data" });
    }
});

router.get('/global-vote', async (req, res) => {
    try {
        const userId = req.session.userId;

        const [session] = await db.query(`
            SELECT id, type FROM voting_sessions WHERE is_active = 1 AND started = 1 AND ended = 0
        `);

        if (!session[0] || session[0].type !== 'user') {
            return res.status(400).json({ error: 'Aucune session de vote utilisateur en cours' });
        }

        const [userVote] = await db.query(`
            SELECT COUNT(*) as count FROM votes 
            WHERE user_id = ? AND session_id = ?
        `, [userId, session[0].id]);

        if (userVote[0].count > 0) {
            return res.status(403).json({ error: 'Vous avez déjà voté dans cette session' });
        }

        const [propositions] = await db.query(`
    SELECT p.*, 
           GROUP_CONCAT(CASE WHEN i.type = 'before' THEN i.filename END) AS before_images, 
           GROUP_CONCAT(CASE WHEN i.type = 'after' THEN i.filename END) AS after_images
    FROM propositions p
    JOIN proposition_status ps ON p.id = ps.proposition_id
    LEFT JOIN images i ON p.id = i.proposition_id
    WHERE ps.voting_session_id = ?
    GROUP BY p.id
`, [session[0].id]);

        if (propositions.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition disponible pour le vote' });
        }


        res.render('layouts/main', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,
            propositions: propositions,
            title: 'Vote Global',
            view: '../voting-sessions/global-vote.ejs',
            css: ['detailProposition.css'],
            js: ['global-vote.js', 'sweet-alert.js'],
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur', details: error });
    }
});

router.post('/global-vote/submit', async (req, res) => {

    const { votes } = req.body;
    const userId = req.session.userId;

    try {
        const [session] = await db.query(`
            SELECT id, type FROM voting_sessions WHERE is_active = 1 AND started = 1 AND ended = 0
        `);

        if (!session[0] || session[0].type !== 'user') {
            return res.status(400).json({ error: 'Aucune session de vote utilisateur en cours' });
        }

        const [userVote] = await db.query(`
            SELECT COUNT(*) as count FROM votes 
            WHERE user_id = ? AND session_id = ?
        `, [userId, session[0].id]);

        if (userVote[0].count > 0) {
            return res.status(403).json({ error: 'Vous avez déjà voté dans cette session' });
        }
        const connection = await db.getConnection();
        let votePromises;
        try {
            await connection.beginTransaction();

            votePromises = votes.map(vote =>
                connection.query(`
                INSERT INTO votes (session_id, proposition_id, user_id, vote_value)
                VALUES (?, ?, ?, ?)
            `, [session[0].id, vote.propositionId, userId, vote.value ? vote.value : 0])
            );
            await Promise.all(await votePromises);
            await connection.commit();

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

        res.status(201).json({ message: 'Votes soumis avec succès' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la soumission des votes', details: error });
    }
});

router.get('/:id/resultats-votes-global', async (req, res) => {
    try {
        const sessionId = req.params.id;

        const [session] = await db.query('SELECT * FROM voting_sessions WHERE id = ?', [sessionId]);

        if (session.length === 0) {
            return res.status(404).json({ error: 'Session non trouvée' });
        }
        if (!session[0].ended && !req.session.isAdmin) {
            return res.redirect('/propositions/mes-propositions');
        }

        const [propositionsStatus] = await db.query(`
            SELECT 
                ps.proposition_id, 
                ps.is_validated, 
                ps.average_grade, 
                p.id, 
                p.date_emission,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                p.objet,
                p.description_situation_actuelle,
                p.description_amelioration_proposee,
                p.impact_economique, 
                p.impact_technique, 
                p.impact_formation, 
                p.impact_fonctionnement 
            FROM proposition_status ps
            JOIN propositions p ON ps.proposition_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE ps.voting_session_id = ?
        `, [sessionId]);

        if (propositionsStatus.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition trouvée pour cette session' });
        }

        // Sort propositions into categories based on impacts
        const economicImpactPropositions = propositionsStatus
            .filter(prop => prop.impact_economique)
            .sort((a, b) => b.average_grade - a.average_grade);
        const technicalImpactPropositions = propositionsStatus
            .filter(prop => prop.impact_technique)
            .sort((a, b) => b.average_grade - a.average_grade);
        const trainingImpactPropositions = propositionsStatus
            .filter(prop => prop.impact_formation)
            .sort((a, b) => b.average_grade - a.average_grade);
        const operationalImpactPropositions = propositionsStatus
            .filter(prop => prop.impact_fonctionnement)
            .sort((a, b) => b.average_grade - a.average_grade);

        res.render('layouts/main', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,
            session: session[0],
            sessionId,
            economicImpactPropositions,
            technicalImpactPropositions,
            trainingImpactPropositions,
            operationalImpactPropositions,
            title: 'Details session',
            view: '../voting-sessions/global-vote-results',
            css: ['global-vote-results.css'],
            js: ['sweet-alert.js']
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de base de données', details: error });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const sessionId = req.params.id;

        const [session] = await db.query('SELECT * FROM voting_sessions WHERE id = ?', [sessionId]);

        if (session.length === 0) {
            return res.status(404).json({ error: 'Session non trouvée' });
        }
        if (!session[0].ended && !req.session.isAdmin) {
            return res.redirect('/propositions/mes-propositions')
        }

        const [propositionsStatus] = await db.query(`
            SELECT 
                ps.proposition_id, 
                ps.is_validated,
                ps.average_grade,
                p.id,
                p.date_emission,
                CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS full_name,
                COALESCE(p.objet, description_situation_actuelle) as objet,
                p.description_situation_actuelle,
                p.description_amelioration_proposee,
                p.is_excluded
            FROM proposition_status ps
            JOIN propositions p ON ps.proposition_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE ps.voting_session_id = ?
        `, [sessionId]);

        if (propositionsStatus.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition trouvée pour cette session' });
        }

        res.render('layouts/main', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,
            session: session[0],
            propositions: propositionsStatus,
            sessionId,
            title: 'Details session',
            view: '../voting-sessions/details',
            css: ['tables.css'],
            js: ['sweet-alert.js', 'ag-grid.js']
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de base de données', details: error });
    }
});

module.exports = router;
