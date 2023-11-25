import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserTokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
