const _ = require('lodash');
const { Stations, StationType, Companies } = require('../model');
const { getChildCompanies, getCompanyStations } = require('../util');

const createContext = async () => {
    const companies = await Companies.findAll({nest: true, raw: true}).then(list => _.keyBy(list, 'id')); 

    const walkup = id => companies[id] ? [id, ...walkup(companies[id].parentId)] : []

    const stations = await Stations.findAll({include: {model: StationType, attributes:['maxPower']}, nest: true, raw: true});
    stations.forEach(station => station.owners = walkup(station.companyId));

    return {
        stations: _.keyBy(stations, 'id'),
        companies,
    }
}

const initContext = context => context.isActive = true

const closeContext = context => context.isActive = false

module.exports = {
    createContext, initContext, closeContext
}