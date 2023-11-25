import { Field, ObjectType } from 'type-graphql';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Field()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Field()
  @CreateDateColumn()
  readonly updatedAt: Date;
}
