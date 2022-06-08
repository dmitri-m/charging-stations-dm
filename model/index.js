const { sequelize, Sequelize } = require('../config/sequelize');

const StationType = sequelize.define('StationTypes', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
  maxPower: {
    type: Sequelize.INTEGER,
    allowNull: false,
    require: true,
  },
});

const Companies = sequelize.define('Companies', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
});

const Stations = sequelize.define('Stations', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
});


Companies.hasMany(Companies, {as: 'children', foreignKey: 'parentId', onDelete: 'RESTRICT'});
Companies.belongsTo(Companies, {as: 'parent',  foreignKey: 'parentId', targetKey: 'id', onDelete: 'RESTRICT'});

StationType.hasMany(Stations, {foreignKey: 'stationTypeId', allowNull: false, onDelete: 'RESTRICT'});
Stations.belongsTo(StationType, {foreignKey: 'stationTypeId', allowNull: false, onDelete: 'RESTRICT'});

Companies.hasMany(Stations, {foreignKey: 'companyId', allowNull: false, onDelete: 'RESTRICT'});
Stations.belongsTo(Companies, {foreignKey: 'companyId'});

if (process.env.NODE_ENV === 'test') {
  StationType.sync({force:true}).then(table => console.log('Init table:', table));
  Companies.sync({force:true}).then(table => console.log('Init table:', table));
  Stations.sync({force:true}).then(table => console.log('Init table:', table));
} else {
  StationType.sync().then(table => console.log('Init table:', table));
  Companies.sync().then(table => console.log('Init table:', table));
  Stations.sync().then(table => console.log('Init table:', table));
}

module.exports = { StationType, Stations, Companies };