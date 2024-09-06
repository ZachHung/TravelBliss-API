import { Repository } from 'typeorm';

import { BaseEntity } from './entity';

export default interface BaseRepository<T extends BaseEntity> extends Repository<T> {
  findOneWhere: (column: keyof T, value: string | number, operator: string) => Promise<T | null>;
}
