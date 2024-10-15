const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/uploadConfig');
const path = require('path');

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
      css: ["tables.css"],
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
      css: ["tables.css"],
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
    js: ['propositionForm.js']
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

// function normalizeStatus(status) {
//   switch (status) {
//     case 'soldée':
//       return 'soldee';
//     case 'En cours':
//       return 'en cours';
//     case 'Annulée':
//       return 'annulee';
//     default:
//       return 'non soldee'; 
//   }
// }

// router.get('/process', async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, '../public', 'file.xlsx');
//     const workbook = xlsx.readFile(filePath);

//     const sheetName = workbook.SheetNames[1];
//     const sheet = workbook.Sheets[sheetName];

//     const data = xlsx.utils.sheet_to_json(sheet);

//     for (const row of data) {
//       const dateEmission = excelDateToJSDate(row['Date d´émission']);
//       if (dateEmission.getFullYear() !== 2024) {
//         continue;
//       }
//       const userIds = await findUserIds(row['Nom/Prénom']);
//       if (userIds.length > 0) {
//         for (const userId of userIds) {
//           await addProposition(row, userId);
//           break;
//         }
        
//       } else {
//         console.warn(`No users found for: ${row['Nom/Prénom']}`);
//       }
//     }

//     res.send('Data processed successfully!');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error processing the file.');
//   }
// });

// function excelDateToJSDate(serial) {
//   const utc_days = Math.floor(serial - 25569);
//   const utc_value = utc_days * 86400;
//   const date_info = new Date(utc_value * 1000);
//   return date_info;
// }

// async function findUserIds(fullName) {
//   const names = fullName.split(/ et | \/ | \+ /);
//   const userIds = [];

//   for (const name of names) {
//     const firstName = name.trim();
//     const [rows] = await db.query('SELECT id FROM users WHERE first_name = ?', [firstName]);
//     if (rows.length > 0) {
//       userIds.push(rows[0].id);
//     }
//   }

//   return userIds;
// }

// async function addProposition(row, userId) {
//   const dateEmission = row['Date d´émission'] ? excelDateToJSDate(row['Date d´émission']) : new Date();

//   const retenu = row['Retenu/non retenu'] === 'Retenu' ? 1 : 0;

//   const functionName = row['Fonction'];
//   const [functionRows] = await db.query('SELECT id FROM functions WHERE name = ?', [functionName]);
//   const functionId = functionRows.length > 0 ? functionRows[0].id : null;

//   await db.query('INSERT INTO propositions (id, date_emission, user_id, description_situation_actuelle, description_amelioration_proposee, retenu, Critère_de_sélection, Délai_initial, nouveau_délai, Sponsor, Date_de_réalisation, Remarque, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
//     row['N suggestion'],
//     dateEmission,
//     userId,
//     row['Description de la situation actuelle'],
//     row['Description de l\'amélioration proposée'],
//     retenu,
//     row['Critère de sélection'],
//     excelDateToJSDate(row['Délai initial']),
//     excelDateToJSDate(row['nouveau délai']),
//     row['Sponsor'],
//     row['Date de réalisation'] ? excelDateToJSDate(row['Date de réalisation']) : null,
//     row['Remarque'],
//     normalizeStatus(row['Statut'])
//   ]);
// }

// router.get('/fill/:n', upload.none(), async (req, res) => {
//   const user_id = req.session.userId;
//   const n = req.params.n;

//   try {
//     await db.query('START TRANSACTION');

//     for (let i = 0; i < n; i++) {
//       const objet = chance.sentence({ words: 20 });
//       const description_situation_actuelle = chance.paragraph({ sentences: 5 });
//       const description_amelioration_proposee = chance.paragraph({ sentences: 5 });
//       const impact_economique = chance.integer({ min: 0, max: 100 });
//       const impact_technique = chance.integer({ min: 0, max: 100 });
//       const impact_formation = chance.integer({ min: 0, max: 100 });
//       const impact_fonctionnement = chance.integer({ min: 0, max: 100 });
//       const statut = 'non soldee';

//       await db.query(
//         `INSERT INTO propositions 
//           (objet, description_situation_actuelle, description_amelioration_proposee, user_id, impact_economique, impact_technique, impact_formation, impact_fonctionnement, statut) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           objet,
//           description_situation_actuelle,
//           description_amelioration_proposee,
//           user_id,
//           impact_economique,
//           impact_technique,
//           impact_formation,
//           impact_fonctionnement,
//           statut
//         ]
//       );
//     }

//     await db.query('COMMIT');

//     res.json({ success: true, message: `${n} propositions added successfully.` });
//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.log(error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

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
      css: ['propositionForm.css'],
      js: ['propositionForm.js'],
      view: '../users/modifierProposition'
    });
  } catch (error) {
    console.error(`Error fetching proposition for edit: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update/:id', async (req, res) => {
  const propositionId = req.params.id;
  const { objet, description_situation_actuelle, description_amelioration_proposee, impact_economique, impact_fonctionnement, impact_formation, impact_technique, statut } = req.body;
  console.log(req.body);

  try {
    await db.query(
      `UPDATE propositions 
       SET objet = ?, description_situation_actuelle = ?, description_amelioration_proposee = ?, impact_economique = ?, impact_fonctionnement = ?, impact_formation = ?, impact_technique = ? ,statut = ?
       WHERE id = ?`,
      [objet, description_situation_actuelle, description_amelioration_proposee,
        impact_economique || 0,
        impact_technique || 0,
        impact_formation || 0,
        impact_fonctionnement || 0,
        statut, propositionId]
    );

    res.redirect(`/propositions/proposition/${propositionId}`);
  } catch (error) {
    console.error(`Error updating proposition: ${error.message}`);
    res.status(500).send('Internal Server Error');
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
