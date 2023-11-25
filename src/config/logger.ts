import moment from 'moment';
import { createLogger, transports, format } from 'winston';
import * as dotenv from 'dotenv';
import { getEnv } from '../utils/helpers';
dotenv.config();

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

if (getEnv('NODE_ENV') !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: () => moment().local().format('HH:mm:ss'),
        }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        }),
      ),
    }),
  );
}
export default logger;
