import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AuthCheckerInterface, ResolverData } from 'type-graphql';
import { PostgresDataSource } from '../../config/data-source';
import { User } from '../../modules/user/user.entity';
import { Context, UserPayload } from '../../types';
import { getEnv } from '../../utils/helpers';
import { Injectable } from '../../types/inversify';

dotenv.config();

@Injectable()
export class CustomAuthChecker implements AuthCheckerInterface<Context> {
  async check({ context }: ResolverData<Context>, roles: string[]): Promise<boolean> {
    try {
      const authorization = context.req.headers.authorization;
      if (!authorization) return false;
      const [schema, token] = authorization.split(' ');
      if (schema !== 'Bearer') return false;
      const payload = jwt.verify(token, getEnv('SECRET_JWT')) as UserPayload;
      //
      const userRepo = PostgresDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { id: payload.id } });
      if (!user) return false;

      if (!roles.includes(user.role) && roles.length !== 0) return false;
      context.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
}
