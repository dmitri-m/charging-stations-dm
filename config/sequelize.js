const Sequelize = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize('sqlite::memory:');
} else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './stationdb.sqlite3',
        logging: console.log,
    });
}

sequelize.authenticate().then(() => console.log("Connected to database"));

module.exports = { sequelize, Sequelize };