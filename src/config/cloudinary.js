const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration du SDK Cloudinary via variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Storage pour les images (projets) ────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// ─── Storage pour le CV (PDF) ─────────────────────────────────────────────────
const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/cv',
    resource_type: 'raw',
    type: 'upload',              // 'upload' = URL propre sans signature en base
    format: 'pdf',
    public_id: (req, file) => `cv-${Date.now()}`,
  },
});

/**
 * Supprime un fichier de Cloudinary à partir de son URL ou public_id
 * @param {string} urlOrPublicId - URL Cloudinary complète ou public_id
 * @param {string} resourceType - 'image' | 'raw' (pour les PDF)
 */
const deleteFromCloudinary = async (urlOrPublicId, resourceType = 'image') => {
  if (!urlOrPublicId) return;
  try {
    // Extraire le public_id depuis l'URL Cloudinary
    let publicId = urlOrPublicId;
    if (urlOrPublicId.includes('cloudinary.com')) {
      // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/portfolio/filename.ext
      const parts = urlOrPublicId.split('/upload/');
      if (parts[1]) {
        // Retirer le version prefix (v123456/) et l'extension
        publicId = parts[1].replace(/^v\d+\//, '');
        // Pour les images, retirer l'extension
        if (resourceType === 'image') {
          publicId = publicId.replace(/\.[^/.]+$/, '');
        }
      }
    }
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Erreur suppression Cloudinary:', err.message);
  }
};

module.exports = { cloudinary, imageStorage, cvStorage, deleteFromCloudinary };

