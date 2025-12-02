import pino from 'pino';
import fs from 'fs';
import path from 'path';
const logDirectory = path.join(__dirname, '..', 'logs'); 
const logFilePath = path.join(logDirectory, 'app.log.json'); 
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
const destination = pino.destination({ dest: logFilePath, sync: true }); 
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    log: (obj) => ({
      ...obj, 
    }),
  },
}, destination);
export default logger;


