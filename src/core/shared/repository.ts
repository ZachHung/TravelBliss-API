import { ObjectLiteral, Repository } from 'typeorm';

export default interface BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  findOneWhere: (column: string, value: string | number, operator: string) => Promise<T | null>;
}
