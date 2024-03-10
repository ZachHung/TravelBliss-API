import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import { dotenvInit, getEnv } from '../utils/helpers';
dotenvInit();

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: () => moment().local().format('YYYY-MM-DD HH:mm:ss:SSS'),
    }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    }),
  ),
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: `${moment().local().format('YYYY-MM-DD')}.log`,
    }),
  ],
});

const env = getEnv('NODE_ENV').toUpperCase();
logger.add(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: () => moment().local().format('HH:mm:ss'),
      }),
      format.printf(({ timestamp, level, message }) => {
        return `[${env}] [${timestamp}] [${level}]: ${message}`;
      }),
    ),
  }),
);
export default logger;
