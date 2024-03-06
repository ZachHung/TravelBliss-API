import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import TOKEN from '../../core/container/types.container';
import { User } from './user.entity';
import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { UserService } from './user.service';
import { UserTokens } from './user.type';
import { Context } from '../../types';
import { Role } from '../../types/enums';
import { Inject, Injectable } from '../../types/inversify';

@Injectable()
@Resolver(() => User)
export class UserResolver {
  constructor(@Inject(TOKEN.Services.User) private readonly userService: UserService) {}

  @Authorized()
  @Query((_type) => User)
  public async me(@Ctx() { req }: Required<Context>): Promise<User> {
    const response = await this.userService.findById(req.session.userId);
    return response;
  }

  @Authorized(Role.ADMIN)
  @Query(() => [User])
  public async allUser(): Promise<User[]> {
    const response = await this.userService.getAll();
    return response;
  }

  @Mutation((_type) => User)
  public async register(@Arg('input') input: RegisterInput): Promise<User> {
    const response = await this.userService.register(input);
    return response;
  }

  @Mutation((_type) => UserTokens)
  public async login(@Arg('input') input: LoginInput, @Ctx() ctx: Context): Promise<UserTokens> {
    const response = await this.userService.login(input, ctx);
    return response;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context): Promise<boolean> {
    const response = await this.userService.logout(ctx);
    return response;
  }

  @Authorized()
  @Mutation((_type) => User)
  public async editInfoUser(
    @Arg('input') input: EditInfoInput,
    @Ctx() { req }: Required<Context>,
  ): Promise<User> {
    const response = await this.userService.editInfo(input, req.session.userId);
    return response;
  }

  @Authorized()
  @Mutation(() => User)
  public async changePasswordUser(
    @Arg('input') input: ChangePasswordInput,
    @Ctx() { req }: Required<Context>,
  ): Promise<User> {
    const response = await this.userService.changePassword(input, req.session.userId);
    return response;
  }
}
