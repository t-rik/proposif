const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/uploadConfig');
// const checkUserOwnership = require('../middleware/checkUserOwnership');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

router.get('/:propositionId/:type/:filename', (req, res) => {
    const { propositionId, type, filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/private', `proposition_${propositionId}`, type, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: 'File not found.' });
    }
});

router.post('/upload/:propositionId', (req, res) => {
    upload.fields([
        { name: 'beforeImages', maxCount: 1 },
        { name: 'afterImages', maxCount: 1 }
    ])(req, res, async (err) => {
        const propositionId = req.params.propositionId;

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'La taille du fichier est trop grande. La taille maximale est de 5 Mo.' });
            }
            return res.status(400).json({ error: 'Erreur du serveur lors du téléchargement du fichier.' });
        }

        else if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.files.beforeImages && !req.files.afterImages) {
            return res.status(400).json({ error: 'Aucune image n\'a été téléchargée.' });
        }

        try {
            const uploadedFiles = [];

            if (req.files.beforeImages) {
                for (const file of req.files.beforeImages) {
                    const [result] = await db.query(
                        'INSERT INTO images (proposition_id, type, filename, file_size, original_name) VALUES (?, ?, ?, ?, ?)',
                        [propositionId, 'before', file.filename, file.size, file.originalname]
                    );
                    uploadedFiles.push({ fileId: result.insertId, fileName: file.filename, size: file.size });
                }
            }

            if (req.files.afterImages) {
                for (const file of req.files.afterImages) {
                    const [result] = await db.query(
                        'INSERT INTO images (proposition_id, type, filename, file_size, original_name) VALUES (?, ?, ?, ?, ?)',
                        [propositionId, 'after', file.filename, file.size, file.originalname]
                    );
                    uploadedFiles.push({ fileId: result.insertId, fileName: file.filename, size: file.size });
                }
            }

            res.json({ success: true, uploadedFiles });

        } catch (error) {
            console.error(`Erreur lors de l'insertion des images : ${error.message}`);
            res.status(500).json({ error: 'Erreur de la base de données lors de l\'enregistrement des images.' });
        }
    });
});

router.delete('/delete/:id', async (req, res) => {
    const imageId = req.params.id;

    try {
        const [image] = await db.query('SELECT * FROM images WHERE id = ?', [imageId]);
        if (image.length === 0) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        const filePath = path.join(__dirname, '../uploads/private', `proposition_${image[0].proposition_id}`, image[0].type, image[0].filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.query('DELETE FROM images WHERE id = ?', [imageId]);

        res.json({ success: true, message: 'Image deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting image: ${error.message}`);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the image.' });
    }
});

router.get('/proposition/:id', async (req, res) => {
    const propositionId = req.params.id;
    const imageType = req.query.type;

    try {
        const [images] = await db.query(
            `SELECT * FROM images WHERE proposition_id = ? AND type = ?`,
            [propositionId, imageType]
        );
        console.log('test');
        
        res.json({ success: true, images });
    } catch (error) {
        console.error(`Error fetching images: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
