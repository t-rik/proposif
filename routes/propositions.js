const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/uploadConfig');
const checkUserOwnership = require('../middleware/checkUserOwnership');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM propositions');

    res.render('layouts/main', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      isJury: req.session.isJury,
      title: 'Propositions',
      propositions: results,
      hasPropositions: results.length > 0,
      css: [],
      js: [],
      view: '../admin/propositions/list'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/mes-propositions', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM propositions WHERE user_id = ?', [req.session.userId]);

    res.render('layouts/main', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      isJury: req.session.isJury,
      title: 'Mes Propositions',
      propositions: results,
      hasPropositions: results.length > 0,
      css: [],
      js: [],
      view: '../users/mespropositions'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.get('/add', (req, res) => {
  res.render('layouts/main', {
    userId: req.session.userId,
    isAdmin: req.session.isAdmin,
    isJury: req.session.isJury,
    title: 'add proposition',
    view: '../users/propositionForm',
    css: ['propositionForm.css'],
    js: []
  });
});

router.post('/add', upload.none(), async (req, res) => {
  const {
    objet,
    description_situation_actuelle,
    description_amelioration_proposee,
    impact_economique,
    impact_technique,
    impact_formation,
    impact_fonctionnement,
    statut
  } = req.body;

  const user_id = req.session.userId;

  try {
    const [result] = await db.query(
      `INSERT INTO propositions 
        (objet, description_situation_actuelle, description_amelioration_proposee, user_id, impact_economique, impact_technique, impact_formation, impact_fonctionnement, statut) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        objet,
        description_situation_actuelle,
        description_amelioration_proposee,
        user_id,
        impact_economique || 0,
        impact_technique || 0,
        impact_formation || 0,
        impact_fonctionnement || 0,
        statut || 'non soldee'
      ]
    );

    res.json({ success: true, propositionId: result.insertId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/proposition/:id', async (req, res) => {
  const propositionId = req.params.id;

  try {
    const [proposition] = await db.query(
      `SELECT * FROM propositions WHERE id = ?`,
      [propositionId]
    );

    const [images] = await db.query(
      `SELECT * FROM images WHERE proposition_id = ?`,
      [propositionId]
    );

    const beforeImages = images.filter(img => img.type === 'before');
    const afterImages = images.filter(img => img.type === 'after');

    res.render('layouts/main', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      isJury: req.session.isJury,

      title: proposition.objet,
      proposition: proposition[0],
      beforeImages,
      afterImages,
      css: ['detailProposition.css'],
      js: ['detailProposition.js'],
      view: '../users/detailProposition'
    });
  } catch (error) {
    console.error(`Error fetching proposition: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/proposition/edit/:id', async (req, res) => {
  const propositionId = req.params.id;

  try {
    const [proposition] = await db.query(
      `SELECT * FROM propositions WHERE id = ?`,
      [propositionId]
    );

    if (!proposition) {
      return res.status(404).send('Proposition not found');
    }

    res.render('layouts/main', {
      userId: req.session.userId,
      isAdmin: req.session.isAdmin,
      isJury: req.session.isJury,

      title: `Edit Proposition - ${proposition.objet}`,
      proposition: proposition[0],
      css: ['modifierProposition.css'],
      js: ['modifierProposition.js'],
      view: '../users/modifierProposition'
    });
  } catch (error) {
    console.error(`Error fetching proposition for edit: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update/:id', async (req, res) => {
  const propositionId = req.params.id;
  const { objet, description_situation_actuelle, description_amelioration_proposee, statut } = req.body;

  try {
    await db.query(
      `UPDATE propositions 
       SET objet = ?, description_situation_actuelle = ?, description_amelioration_proposee = ?, statut = ?
       WHERE id = ?`,
      [objet, description_situation_actuelle, description_amelioration_proposee, statut, propositionId]
    );

    res.redirect(`/propositions/proposition/${propositionId}`);
  } catch (error) {
    console.error(`Error updating proposition: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/:id', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE propositions SET excluded = 1 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Proposition not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
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

router.delete('/:id/delete', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM propositions WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Proposition not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
