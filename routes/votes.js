const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/uploadConfig');
const checkUserOwnership = require('../middleware/checkUserOwnership');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

router.post('/init', async (req, res) => {
    const { type } = req.body;

    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!['jury', 'user'].includes(type)) {
        return res.status(400).json({ error: 'Invalid voting session type' });
    }

    try {
        const [activeSession] = await db.query('SELECT * FROM voting_sessions WHERE is_active = 1');

        if (activeSession.length > 0) {
            return res.status(400).json({ message: 'There is already an ongoing voting session' });
        }

        const [propositions] = await db.query(`SELECT p.*
            FROM propositions p
            LEFT JOIN proposition_status ps ON p.id = ps.proposition_id
            LEFT JOIN votes v ON p.id = v.proposition_id 
            WHERE p.is_excluded = 0
            AND p.statut = 'soldee'
            AND v.proposition_id IS NULL;
        `);

        if (propositions.length === 0) {
            return res.status(400).json({ message: 'No propositions available for voting' });
        }

        await db.query('UPDATE propositions SET locked = 1 WHERE id IN (?)', [
            propositions.map(p => p.id),
        ]);

        const [result] = await db.query(
            'INSERT INTO voting_sessions (type, init_time, is_active) VALUES (?, NOW(), 1)',
            [type]
        );

        const statusInsertPromises = propositions.map(p => {
            return db.query('INSERT INTO proposition_status (proposition_id, voting_session_id) VALUES (?, ?)', [p.id, result.insertId]);
        });

        await Promise.all(statusInsertPromises);

        res.status(201).json({
            success: true,
            message: 'Voting session initialized',
            sessionId: result.insertId,
            propositions,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.get('/:sessionId/propositions', async (req, res) => {
    const { sessionId } = req.params;
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const [propositions] = await db.query(`
            SELECT p.*
            FROM propositions p
            JOIN proposition_status ps ON p.id = ps.proposition_id
            WHERE ps.voting_session_id = ?
            AND p.locked = 1
        `, [sessionId]);

        if (propositions.length === 0) {
            return res.status(404).json({ message: 'No propositions found for this session' });
        }

        res.json(propositions);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
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

        await db.query('UPDATE propositions SET can_be_voted = 1 WHERE locked = 1');

        res.json({ message: 'Voting session started, jury can vote now' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.post('/:sessionId/vote', async (req, res) => {
    const { sessionId } = req.params;
    const { propositionId, grade } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (grade < 1 || grade > 5) {
        return res.status(400).json({ error: 'Invalid grade, must be between 1 and 5' });
    }

    try {
        const [session] = await db.query('SELECT * FROM voting_sessions WHERE id = ? AND is_active = 1', [sessionId]);

        if (session.length === 0) {
            return res.status(404).json({ message: 'No active voting session found' });
        }

        const [proposition] = await db.query('SELECT * FROM propositions WHERE id = ? AND can_be_voted = 1', [propositionId]);

        if (proposition.length === 0) {
            return res.status(404).json({ message: 'Proposition not available for voting' });
        }

        const [existingVote] = await db.query(
            'SELECT * FROM votes WHERE user_id = ? AND proposition_id = ? AND session_id = ?',
            [userId, propositionId, sessionId]
        );

        if (existingVote.length > 0) {
            await db.query('UPDATE votes SET grade = ? WHERE user_id = ? AND proposition_id = ? AND session_id = ?', [
                grade,
                userId,
                propositionId,
                sessionId,
            ]);
        } else {
            await db.query('INSERT INTO votes (user_id, proposition_id, session_id, grade) VALUES (?, ?, ?, ?)', [
                userId,
                propositionId,
                sessionId,
                grade,
            ]);
        }

        res.json({ message: 'Vote submitted' });
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

router.post('/:sessionId/start-user-vote', async (req, res) => {
    const { sessionId } = req.params;

    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [sessionResult] = await db.query('UPDATE voting_sessions SET is_active = 1 WHERE id = ?', [sessionId]);

        if (sessionResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Voting session not found' });
        }

        await db.query('UPDATE propositions SET can_be_voted = 1 WHERE validated = 1');

        res.json({ message: 'User voting session started on validated propositions' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.post('/:sessionId/user-vote', async (req, res) => {
    const { sessionId } = req.params;
    const { propositionId, grade } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (grade < 1 || grade > 5) {
        return res.status(400).json({ error: 'Invalid grade, must be between 1 and 5' });
    }

    try {
        const [proposition] = await db.query('SELECT * FROM propositions WHERE id = ? AND can_be_voted = 1 AND validated = 1', [propositionId]);

        if (proposition.length === 0) {
            return res.status(404).json({ message: 'Proposition not available for user voting' });
        }

        const [existingVote] = await db.query(
            'SELECT * FROM user_votes WHERE user_id = ? AND proposition_id = ? AND session_id = ?',
            [userId, propositionId, sessionId]
        );

        if (existingVote.length > 0) {
            await db.query('UPDATE user_votes SET grade = ? WHERE user_id = ? AND proposition_id = ? AND session_id = ?', [
                grade,
                userId,
                propositionId,
                sessionId,
            ]);
        } else {
            await db.query('INSERT INTO user_votes (user_id, proposition_id, session_id, grade) VALUES (?, ?, ?, ?)', [
                userId,
                propositionId,
                sessionId,
                grade,
            ]);
        }

        res.json({ message: 'User vote submitted' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});

router.post('/exclude/:propositionId', async (req, res) => {
    try {
        await db.query('UPDATE propositions SET is_excluded = 1 WHERE id = ?', [req.params.propositionId]);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

router.post('/include/:propositionId', async (req, res) => {
    try {
        await db.query('UPDATE propositions SET is_excluded = 0 WHERE id = ?', [req.params.propositionId]);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

router.get('/', async (req, res) => {
    const sessions = await db.query('SELECT * FROM voting_sessions');

    res.render('voting-sessions/list', {
        sessions: sessions[0], userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        isJury: req.session.isJury,
    });
});

router.get('/:id', async (req, res) => {
    try {
        const sessionId = req.params.id;

        const [session] = await db.query('SELECT * FROM voting_sessions WHERE id = ?', [sessionId]);

        if (session.length === 0) {
            return res.status(404).json({ error: 'Session non trouvée' });
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
                p.is_excluded 
            FROM proposition_status ps
            JOIN propositions p ON ps.proposition_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE ps.voting_session_id = ?
        `, [sessionId]);

        if (propositionsStatus.length === 0) {
            return res.status(404).json({ message: 'Aucune proposition trouvée pour cette session' });
        }

        res.render('voting-sessions/details', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,

            session: session[0],
            propositions: propositionsStatus,
            sessionId,
            locale: 'fr'
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de base de données', details: error });
    }
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
        await db.query('UPDATE propositions SET is_excluded = 1 WHERE id IN (SELECT proposition_id FROM proposition_status WHERE voting_session_id = ? AND is_validated = 0)', [req.params.sessionId]);

        await db.query('UPDATE propositions SET locked = 0 WHERE id IN (SELECT proposition_id FROM proposition_status WHERE voting_session_id = ?)', [req.params.sessionId]);

        await db.query('DELETE FROM proposition_status WHERE voting_session_id = ?', [req.params.sessionId]);


        await db.query('DELETE FROM votes WHERE session_id = ?', [req.params.sessionId]);

        await db.query('DELETE FROM voting_sessions WHERE id = ?', [req.params.sessionId]);

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
});
router.get('/proposition/:id', async (req, res) => {
    const propositionId = req.params.id;

    try {
        const [proposition] = await db.query(`
            SELECT p.*, 
                   CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
                   ps.voting_session_id
            FROM propositions p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN proposition_status ps ON ps.proposition_id = p.id
            WHERE p.id = ?
        `, [propositionId]);

        if (proposition.length === 0) {
            return res.status(404).json({ error: 'Proposition not found' });
        }

        res.render('layouts/main', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,
            title: proposition[0].objet,
            proposition: proposition[0],
            votingSessionId: proposition[0].voting_session_id,
            css: ['detailProposition.css'],
            js: ['detailProposition.js'],
            view: '../admin/propositions/details.ejs'
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/jury/vote/:direction', async (req, res) => {
    const userId = req.session.userId;

    const [activeSession] = await db.query('SELECT id FROM voting_sessions WHERE is_active = 1');
    if (activeSession.length === 0) {
        return res.status(400).json({ message: 'No active session found.' });
    }
    const activeSessionId = activeSession[0].id;

    const currentPropositionId = parseInt(req.query.id) || 0;
    const direction = req.params.direction;

    try {
        let operator;
        let order;
        if (direction === 'previous') {
            operator = '<';
            order = 'DESC';
        } else {
            operator = '>';
            order = 'ASC';
        }

        const [proposition] = await db.query(`
            SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
                   ps.average_grade, v.vote_value AS user_vote
            FROM propositions p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN proposition_status ps ON p.id = ps.proposition_id AND ps.voting_session_id = ?
            LEFT JOIN votes v ON p.id = v.proposition_id AND v.user_id = ?
            WHERE p.id ${operator} ? AND p.is_excluded = 0 AND ps.voting_session_id = ?
            ORDER BY p.id ${order}
            LIMIT 1
        `, [activeSessionId, userId, currentPropositionId, activeSessionId]);

        if (proposition.length === 0) {
            return res.status(404).json({ message: 'No more propositions available.' });
        }

        const [minMaxPropositions] = await db.query(`
            SELECT MIN(p.id) AS first_id, MAX(p.id) AS last_id 
            FROM propositions p
            JOIN proposition_status ps ON p.id = ps.proposition_id
            WHERE ps.voting_session_id = ? AND p.is_excluded = 0
        `, [activeSessionId]);

        const firstId = minMaxPropositions[0].first_id;
        const lastId = minMaxPropositions[0].last_id;

        res.render('jury/proposition.ejs', {
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            isJury: req.session.isJury,
            title: proposition[0].objet,
            proposition: {
                ...proposition[0],
                user_vote: proposition[0].user_vote || null,
            },
            firstId,
            lastId
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/jury/proposition/:id/vote', upload.none(), async (req, res) => {
    const propositionId = req.params.id;
    const { grade } = req.body;
    const userId = req.session.userId;

    try {
        const [activeSession] = await db.query(`
            SELECT id FROM voting_sessions WHERE is_active = 1
        `);

        if (activeSession.length === 0) {
            return res.status(400).json({ error: 'No active voting session found.' });
        }

        const activeSessionId = activeSession[0].id;

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

            return res.status(200).json({ message: 'Vote updated successfully.' });
        } else {
            await db.query(`
                INSERT INTO votes (session_id, proposition_id, user_id, vote_value)
                VALUES (?, ?, ?, ?)`,
                [activeSessionId, propositionId, userId, grade]
            );

            return res.status(200).json({ message: 'Vote submitted successfully.' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;