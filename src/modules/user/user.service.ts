import { compare, hash } from 'bcrypt';
import { GraphQLError } from 'graphql';
import { Redis } from 'ioredis';
import { sign } from 'jsonwebtoken';

import TOKEN from '../../core/container/types.container';
import Service from '../../core/shared/service';
import { Context } from '../../types';
import { Inject, Injectable } from '../../types/inversify';
import { getEnv, mutationReturn } from '../../utils/helpers';

import { User } from './user.entity';
import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { UserRepository } from './user.repository';
import { UserTokens } from './user.type';

@Injectable()
export class UserService implements Service<User> {
  constructor(
    @Inject(TOKEN.Repositories.User) private readonly userRepository: UserRepository,
    @Inject(TOKEN.Store.Redis) private readonly store: Redis,
  ) {}

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneWhere('id', id);
    if (!user) throw new GraphQLError('User not found!');
    return user;
  }

  public async register(input: RegisterInput): Promise<User> {
    let { password } = input;
    password = await hash(password, +getEnv('SALT_ROUND'));
    const newUser = this.userRepository.create({ ...input, password });
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async login(input: LoginInput, { res }: Context): Promise<UserTokens> {
    const { password, usernameOrEmailOrPhone } = input;
    const user = await this.userRepository.findOneBy([
      { username: usernameOrEmailOrPhone },
      { email: usernameOrEmailOrPhone },
      { phoneNumber: usernameOrEmailOrPhone },
    ]);

    if (!user) throw new GraphQLError('Invalid credentials');
    const isValidPass = await compare(password, user.password);
    if (!isValidPass) throw new GraphQLError('Invalid credentials');

    const accessToken = sign({ userId: user.id }, getEnv('SECRET_JWT'), {
      expiresIn: getEnv('JWT_EXPIRED'),
    });
    const refreshToken = sign({ userId: user.id }, getEnv('SECRET_REFRESH'), {
      expiresIn: getEnv('REFRESH_EXPIRED'),
    });

    await this.userRepository.save({ ...user, refreshToken });

    res.cookie(getEnv('COOKIE_NAME'), hash(refreshToken, +getEnv('SALT_ROUND')), {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: getEnv('NODE_ENV') === 'production' ? 'none' : 'lax',
      secure: getEnv('NODE_ENV') === 'production',
    });

    return {
      accessToken,
    };
  }

  public async logout({ auth: { exp, token } }: Required<Context>): Promise<boolean> {
    await this.store
      .multi()
      .set(`blacklist:${token}`, token)
      .expireat(`blacklist:${token}`, exp)
      .exec();
    return true;
  }

  public async getAll(): Promise<User[]> {
    const userList = await this.userRepository.find();
    return userList;
  }

  public async editInfo(input: EditInfoInput, userId: string): Promise<User> {
    const update = await mutationReturn<User>(
      // User query builder because of issue https://github.com/typeorm/typeorm/issues/2415
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...input })
        .where('id = :id ', {
          id: userId,
        })
        .returning('*')
        .execute(),
    );
    return update;
  }

  public async changePassword(input: ChangePasswordInput, userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    // Check password hash
    if (!user) throw new GraphQLError('Invalid credentials');
    const isValidPass = await compare(input.oldPassword, user.password);
    if (!isValidPass) throw new GraphQLError('Invalid credentials');

    const newPassword = await hash(input.newPassword, +getEnv('SALT_ROUND'));
    return await mutationReturn<User>(
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: newPassword })
        .where('id = :id ', {
          id: userId,
        })
        .returning('*')
        .execute(),
    );
  }
}
