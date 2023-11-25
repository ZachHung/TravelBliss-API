import { Container } from 'inversify';
import { UserModule } from '../../modules/user/user.module';
import { DataSource } from 'typeorm';
import TOKEN from './types.container';
import { PostgresDataSource } from '../../config/data-source';
import { CustomAuthChecker } from '../middlewares/auth-checker.middleware';
import { ErrorLoggerMiddleware } from '../middlewares/error-logger.middleware';

const container = new Container({ skipBaseClassChecks: true, defaultScope: 'Singleton' });

container.load(new UserModule());
container.bind<DataSource>(TOKEN.DataSource.Postgres).toConstantValue(PostgresDataSource);

// Bind Middlewares
container.bind<CustomAuthChecker>(CustomAuthChecker).to(CustomAuthChecker).inSingletonScope();
container
  .bind<ErrorLoggerMiddleware>(ErrorLoggerMiddleware)
  .to(ErrorLoggerMiddleware)
  .inSingletonScope();

export default container;
