import { IsEmail, IsPositive, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { User } from './user.entity';

@InputType()
export class RegisterInput implements Partial<User> {
  @IsPositive()
  @Field()
  public readonly age!: number;

  @IsEmail()
  @Field()
  public readonly email!: string;

  @Field()
  public readonly firstName!: string;

  @Field()
  public readonly lastName!: string;

  @Field()
  public readonly phoneNumber!: string;

  @MinLength(6)
  @Field()
  public readonly password!: string;

  @Field()
  public readonly username!: string;
}

@InputType()
export class LoginInput implements Readonly<Pick<User, 'password'>> {
  @MinLength(6)
  @Field()
  public readonly password!: string;

  @Field()
  public readonly usernameOrEmailOrPhone!: string;
}

@InputType()
export class EditInfoInput implements Partial<RegisterInput> {
  @IsPositive()
  @Field({ nullable: true })
  public readonly age?: number;

  @IsEmail()
  @Field({ nullable: true })
  public readonly email?: string;

  @Field({ nullable: true })
  public readonly firstName?: string;

  @Field({ nullable: true })
  public readonly lastName?: string;

  @Field({ nullable: true })
  public readonly username?: string;
}

@InputType()
export class ChangePasswordInput {
  @MinLength(6)
  @Field()
  public readonly oldPassword!: string;

  @MinLength(6)
  @Field()
  public readonly newPassword!: string;
}
