import { ContainerModule } from 'inversify';

import { UserService } from './user.service';
import Service from '../../core/shared/service';
import { User } from './user.entity';
import TOKEN from '../../core/container/types.container';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';

export class UserModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind<Service<User>>(TOKEN.Services.User).to(UserService);
      bind<UserResolver>(UserResolver).toSelf();
      bind<UserRepository>(TOKEN.Repositories.User).to(UserRepository);
    });
  }
}
