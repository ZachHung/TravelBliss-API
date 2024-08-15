import { Request, Response } from 'express';

export interface AuthContext {
  userId: string;
  token: string;
  exp: number;
}

export interface Context {
  req: Request;
  res: Response;
  auth?: AuthContext;
}

export type Constructor<T> = new () => T;
