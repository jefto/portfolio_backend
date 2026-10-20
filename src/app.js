const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const cvRoutes = require('./routes/cvRoutes');
const educationRoutes = require('./routes/educationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const volunteeringRoutes = require('./routes/volunteeringRoutes');
const statisticRoutes = require('./routes/statisticRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Middlewares globaux ---

// CORS – autorise toutes les origines en dev
app.use(cors());

// Logger HTTP
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parser JSON et formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés en statique
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Swagger UI (dev & production) ---
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Portfolio API — Docs',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  })
);

// Exposer le JSON brut de la spec (utile pour des outils tiers)
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Routes ---
app.use('/api/auth', authRoutes);

// GET reste public (affichage portfolio) — POST/PUT/DELETE protégés
app.use('/api/projects', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/skills', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/cv', (req, res, next) => {
  if (['POST', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/educations', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/experiences', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/volunteering', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return protect(req, res, next);
  next();
});
app.use('/api/statistics', (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) return protect(req, res, next);
  next();
});

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/volunteering', volunteeringRoutes);
app.use('/api/statistics', statisticRoutes);

// Routes de santé et Keep-Alive (interrogent activement Supabase pour maintenir la BD active)
const { checkHealth } = require('./controllers/healthController');
app.get('/api/health', checkHealth);
app.get('/api/keep-alive', checkHealth);
app.get('/health', checkHealth);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

module.exports = app;
