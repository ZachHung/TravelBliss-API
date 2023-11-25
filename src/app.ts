import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Request } from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { PostgresDataSource } from './config/data-source';
import logger from './config/logger';
import container from './core/container/config.container';
import { CustomAuthChecker } from './core/middlewares/auth-checker.middleware';
import { ErrorLoggerMiddleware } from './core/middlewares/error-logger.middleware';
import { User } from './modules/user/user.entity';
import { Context } from './types';
import { getEnv } from './utils/helpers';
import { resolvers } from './resolvers';

dotenv.config();

export const bootstrap = async (): Promise<void> => {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    await PostgresDataSource.initialize();
    const schema = await buildSchema({
      resolvers: resolvers,
      globalMiddlewares: [ErrorLoggerMiddleware],
      authChecker: CustomAuthChecker,
      container,
    });

    const server = new ApolloServer<Context>({
      schema,
      csrfPrevention: true,
      cache: 'bounded',

      plugins: [
        ApolloServerPluginInlineTrace(),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
    });
    await server.start();
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          return {
            req: req,
            user: (req as Request & { user?: User }).user,
          };
        },
      }),
    );

    httpServer.listen(+getEnv('PORT'), () =>
      logger.info(
        `Server running in ${getEnv('NODE_ENV')} mode at http://localhost:${getEnv(
          'PORT',
        )}/${'graphql'}`,
      ),
    );
  } catch (error: unknown) {
    error instanceof Error && logger.error(error.message);
  }
};
