import { Entity, Column, OneToMany } from 'typeorm';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { Role } from '../../types/enums';
import { BaseEntity } from '../../core/shared/entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Column()
  public firstName!: string;

  @Field()
  @Column()
  public lastName!: string;

  @Field()
  @Column()
  public age!: number;

  @Authorized(Role.ADMIN)
  @Field({ nullable: true })
  @Column()
  public password!: string;

  @Field()
  @Column({ unique: true })
  public email!: string;

  @Field()
  @Column({ unique: true })
  public username!: string;

  @Column({ nullable: true })
  public refreshToken?: string;

  @Authorized(Role.ADMIN)
  @Field(() => Role, { nullable: true })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public role!: Role;

  // @Field(() => [Post], { nullable: 'items' })
  // @OneToMany(() => Post, (post: Post) => post.user)
  // public posts?: Promise<Post[]>;
}
