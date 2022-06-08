const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './stationdb.sqlite3',
    logging: console.log,
});

sequelize.authenticate().then(() => console.log("Connected to database"));

module.exports = { sequelize, Sequelize };