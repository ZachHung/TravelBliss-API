import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import logger from '../../config/logger';
import { GraphQLError } from 'graphql';
import { Context } from '../../types';
import { Injectable } from '../../types/inversify';

@Injectable()
export class ErrorLoggerMiddleware implements MiddlewareInterface<Context> {
  use: MiddlewareFn<Context> = async ({ context, info }: ResolverData<Context>, next: NextFn) => {
    try {
      return await next();
    } catch (err) {
      if (err instanceof GraphQLError)
        logger.error(
          JSON.stringify({
            message: err.message,
            operation: info.operation.operation,
            fieldName: info.fieldName,
            user: context.req.session.userId,
            stack: err.stack,
            locations: err.locations,
          }),
        );
      throw err;
    }
  };
}
