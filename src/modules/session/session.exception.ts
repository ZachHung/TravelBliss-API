import { BaseException } from '../../core/shared/exception';
import { User } from '../user/user.entity';

export enum SessionErrorCodes {
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_COOKIES = 'INVALID_COOKIES',
}

export class InvalidTokenException extends BaseException<User> {
  constructor() {
    super('Invalid token', SessionErrorCodes.INVALID_TOKEN);
  }
}

export class InvalidCookiesException extends BaseException<User> {
  constructor() {
    super('Invalid cookies', SessionErrorCodes.INVALID_COOKIES);
  }
}
