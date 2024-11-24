
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Vous pouvez activer les logs si nécessaire
});

module.exports = sequelize;
