const multer = require('multer');
const path = require('path');

// ─── Images (projets) ───────────────────────────────────────────────────────

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

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

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/cv/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  },
});

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
