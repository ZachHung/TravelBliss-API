import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserTokens {
  @Field()
  public readonly accessToken: string;
}
