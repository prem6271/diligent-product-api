const winston = require("winston");
require('winston-daily-rotate-file');
require('dotenv').config();

const { createLogger, transports } = winston;
const { combine, timestamp, json } = winston.format;

const fileRotateTransport = new transports.DailyRotateFile({
    filename:  process.env.LOGDIR + 'ProductAPI-combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
});

const logger = createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [fileRotateTransport],
});

module.exports = logger;