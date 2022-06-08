const _ = require('lodash')
const strings = require('@supercharge/strings');

const { begin, end, stopStation, startStation, wait } = require('./commands');
const { createContext } = require('./context');

const syntaxError = line => 'Syntax error: ' + line.join(' ')

const execute = async (commands) => {
    const context = await createContext();
    console.log('loaded context', context);

    const result = commands.map(command => command(context)).filter(o => !!o);    
    return result;
}

const parseLine = (line = []) => {
    switch (line[0]) {
        case 'Begin':
            if (line.length != 1) {
                throw syntaxError(line);
            }
            return begin;

        case 'End':
            if (line.length != 1) {
                throw syntaxError(line);
            }
            return end;

        case 'Start':
            if (line.length != 3 || line[1] !== 'station' || !line[2]) {
                throw syntaxError(line);
            }
            return _.curry(startStation)(line[2]);
        
        case 'Stop':
            if (line.length != 3 || line[1] !== 'station' || !line[2]) {
                throw syntaxError(line);
            }
            return _.curry(stopStation)(line[2]);
        
        case 'Wait':
            if (line.length != 2 || !line[1]) {
                throw syntaxError(line);
            }
            return _.curry(wait)(line[1]);
        
        default:
            throw syntaxError(line);
        }
}

const runScript = async (script) => {
    const lines = strings(script).lines()
        .map(line => strings(line).words())
        .filter(line => !_.isEmpty(line));

    const commands = lines.map(parseLine);
    console.log(commands.length, 'commands in script, executing...');
    
    const result = execute(commands);
    console.log(result.length, 'states in script result');

    return result;
} 

module.exports = runScript