import { bootstrap } from './app';
import logger from './config/logger';

(async (): Promise<void> => {
  try {
    await bootstrap();
  } catch (error: unknown) {
    logger.error(error);
  }
})();
