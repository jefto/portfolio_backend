const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // --- Mode production (Render, Heroku, etc.) ---
  // DATABASE_URL fournie par le service PostgreSQL managé
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // --- Mode développement local ---
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté avec succès');
  } catch (error) {
    console.error(`❌ Erreur de connexion PostgreSQL : ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
