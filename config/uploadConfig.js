const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

function waitRandom(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const storage = multer.diskStorage({
  
  destination: async (req, file, cb) => {
    const randomDelay = Math.floor(Math.random() * (1000));
    await waitRandom(randomDelay);

    const propositionId = req.params.propositionId;
    const type = file.fieldname.includes('before') ? 'before' : 'after';

    try {
      const [existingImages] = await db.query(
        'SELECT COUNT(*) AS count FROM images WHERE proposition_id = ? AND type = ?',
        [propositionId, type]
      );

      const existingCount = existingImages[0].count;
      const maxAllowed = 3;

      const currentUploads = req.files?.[file.fieldname]?.length || 0;

      if (existingCount + currentUploads > maxAllowed) {
        return cb(new Error(`Vous ne pouvez pas télécharger plus de ${maxAllowed} images pour "${type}".`));
      }

      const uploadDir = path.join(__dirname, '../uploads/private', `proposition_${propositionId}`, type);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    } catch (error) {
      cb(new Error('Erreur de la base de données lors de la vérification du nombre d\'images.'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier invalide. Seules les images sont autorisées.'));
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload;