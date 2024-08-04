import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import RedisStore from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
import { Redis } from 'ioredis';
import { buildSchema } from 'type-graphql';
import { PostgresDataSource } from './config/data-source';
import logger from './config/logger';
import container from './core/container/config.container';
import { CustomAuthChecker } from './core/middlewares/auth-checker.middleware';
import { ErrorLoggerMiddleware } from './core/middlewares/error-logger.middleware';
import { resolvers } from './resolvers';
import { Context } from './types';
import { Role } from './types/enums';
import { dotenvInit, getEnv } from './utils/helpers';

dotenvInit();

declare module 'express-session' {
  interface Session extends Context {
    userId: string;
    role: Role;
  }
}

export const bootstrap = async (): Promise<void> => {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    await PostgresDataSource.initialize();
    const schema = await buildSchema({
      emitSchemaFile: true,
      resolvers: resolvers,
      globalMiddlewares: [ErrorLoggerMiddleware],
      authChecker: CustomAuthChecker,
      container,
    });

    const redisClient = new Redis(getEnv('REDIS_URI'));

    const server = new ApolloServer<Context>({
      schema,
      csrfPrevention: true,
      cache: 'bounded',

      plugins: [
        ApolloServerPluginInlineTrace(),
        ApolloServerPluginLandingPageLocalDefault({
          embed: { endpointIsEditable: false },
          includeCookies: true,
        }),
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
      introspection: true,
    });
    await server.start();
    app.set('trust proxy', getEnv('NODE_ENV') === 'production');
    app.use(
      '/',
      cors<cors.CorsRequest>({
        origin: 'http://localhost:5173',
        credentials: true,
      }),

      session({
        name: getEnv('COOKIE_NAME'),
        store: new RedisStore({ client: redisClient, prefix: 'travelBliss:' }),
        secret: getEnv('SESSION_SECRET'),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 14,
          httpOnly: true,
          sameSite: getEnv('NODE_ENV') === 'production' ? 'none' : 'lax',
        },
        resave: false,
        saveUninitialized: false,
      }),

      express.json(),

      expressMiddleware(server, {
        context: async ({ req, res }) => {
          return {
            req,
            res,
          };
        },
      }),
    );

    httpServer.listen(+getEnv('PORT'), () =>
      logger.info(
        `Server running in ${getEnv('NODE_ENV')} mode at http://localhost${getEnv('PORT') && ':' + getEnv('PORT')}`,
      ),
    );
  } catch (error: unknown) {
    error instanceof Error && logger.error(error.message);
  }
};
