var winston = require('winston');

function init(level = winston.level.warn) {
    return winston.createLogger({
        level: level, transports: [
            customTransport()]
    });
}

function customTransport() {
    return new winston.transports.Console({
        format: winston.format.combine(
            winston.format.splat(),
            customFormat())
    });
}

function customFormat() {
    return winston.format.printf(info => {
        return `${info.level.toUpperCase()}: ${reportIssue(info.level)} => ${info.message}`
    });
}

function reportIssue(level) {
    return level === 'error' ? 'Please, report issue' : '';
}

module.exports = {
    init: init
};