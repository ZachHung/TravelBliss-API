import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from './enums';

export type UserPayload = JwtPayload & { id: string; role: Role };

export interface Context {
  req: Request;
  user?: UserPayload;
}

export type RequiredContext = Required<Context>;
export type Constructor<T> = new () => T;
