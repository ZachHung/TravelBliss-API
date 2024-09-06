import { DataSource, Repository } from 'typeorm';

import TOKEN from '../../core/container/types.container';
import BaseRepository from '../../core/shared/repository';
import { Inject, Injectable } from '../../types/inversify';

import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> implements BaseRepository<User> {
  constructor(@Inject(TOKEN.DataSource.Postgres) appDataSource: DataSource) {
    super(User, appDataSource.createEntityManager());
  }

  public async findOneWhere(
    column: keyof User,
    value: string | number,
    operator = '=',
  ): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where(`user.${column} ${operator} :value`, { value })
      .getOne();
  }
}
