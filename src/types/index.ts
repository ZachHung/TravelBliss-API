import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from './enums';

export type UserPayload = JwtPayload & { userId: string; role: Role };

export interface Context {
  req: Request & { session: UserPayload };
  res: Response;
}

export type RequiredContext = Required<Context>;
export type Constructor<T> = new () => T;
