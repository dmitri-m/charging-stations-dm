const moment = require('moment');
const _ = require('lodash');

const { initContext, closeContext } = require('./context');

const errorInCommand = (cmd, descr) => `Error in command ${cmd}: ${descr}`

const startCharging = s => s.started = true

const stopCharging = s => s.started = false


const dumpState = (context) => {
    const activeStations = _.values(context.stations).filter(st => st.started);

    const totals = activeStations.reduce((acc, station) => {
        acc.stations.push(station.id)
        acc.power += station.StationType.maxPower;
        
        station.owners.forEach(owner => {
            if (!acc.companies[owner]) {
                acc.companies[owner] = {id: owner, chargingStations: [], chargingPower: 0};
            }
            acc.companies[owner].chargingPower += station.StationType.maxPower;
            acc.companies[owner].chargingStations.push(station.id);  
        })
        return acc;
        
    }, {power: 0, stations: [], companies: {}});

    return {
        timestamp: context.timestamp.unix(),
        companies: _.values(totals.companies),
        totalChargingStations: totals.stations,
        totalChargingPower: totals.power,
    };
}

const begin = (context) => {
    console.log('begin');
    if (context.isActive) {
        throw errorInCommand('Begin', 'script already started');
    }
    
    initContext(context);
    context.timestamp = moment()

    return {
        ...dumpState(context),
        step: 'Begin', 
    };
}

const end = (context) => {
    console.log('end');
    if (!context.isActive) {
        throw errorInCommand('End', 'script not properly started');
    }
    
    closeContext(context);

    return {
        ...dumpState(context),
        step: 'End',
    }
}

const startStation = (station, context) => {
    console.log('start', station);
    if (!context.isActive) {
        throw errorInCommand('Start station ' + station, 'script not properly started');
    }

    if (station === 'all') {
        Object.entries(context.stations).forEach(([, st]) => startCharging(st));
    } else { 
        if (!context.stations[station]) {
            throw errorInCommand('Start station ' + station, 'invalid station id');
        }
        startCharging(context.stations[station]);
    }

    return {
        ...dumpState(context),
        step: 'Start station ' + station, 
    }
}

const stopStation = (station, context) => {
    console.log('stop', station);
    if (!context.isActive) {
        throw errorInCommand('Stop station ' + station, 'script not properly started');
    }

    if (station === 'all') {
        Object.entries(context.stations).forEach(([,st]) => stopCharging(st));
    } else { 
        if (!context.stations[station]) {
            throw errorInCommand('Stop station ' + station, 'invalid station id');
        }
        stopCharging(context.stations[station]);
    }

    return {
        ...dumpState(context),
        step: 'Stop station ' + station, 
    }
}

const wait = (toWait, context) => {
    console.log('wait', toWait)
    if (!context.isActive) {
        throw errorInCommand('Wait', 'script not properly started');
    }

    context.timestamp.add({seconds: toWait})
}

module.exports = {
    begin, end, startStation, stopStation, wait
}