const multer = require('multer');
const { imageStorage, cvStorage } = require('./cloudinary');

// ─── Images (projets) ───────────────────────────────────────────────────────

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou GIF.'), false);
  }
};

const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
});

// ─── CV (PDF) ────────────────────────────────────────────────────────────────

const cvFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés pour le CV.'), false);
  }
};

const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo
});

module.exports = { upload, uploadCV };
