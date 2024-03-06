import { AuthCheckerInterface, ResolverData } from 'type-graphql';
import { PostgresDataSource } from '../../config/data-source';
import { User } from '../../modules/user/user.entity';
import { Context } from '../../types';
import { Injectable } from '../../types/inversify';
import { dotenvInit } from '../../utils/helpers';

dotenvInit();

@Injectable()
export class CustomAuthChecker implements AuthCheckerInterface<Context> {
  async check({ context }: ResolverData<Context>, roles: string[]): Promise<boolean> {
    try {
      const userId = context.req.session.userId;
      if (!userId) return false;
      //
      const userRepo = PostgresDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) return false;

      if (!roles.includes(user.role) && roles.length !== 0) return false;
      return true;
    } catch (error) {
      return false;
    }
  }
}
