import { config } from 'dotenv';
import { GraphQLError } from 'graphql';
import { JwtPayload, verify } from 'jsonwebtoken';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { AuthContext } from '../types';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: '${name}`);
  }
  return value;
};

// Credit: https://stackoverflow.com/questions/47792808/typeorm-update-item-and-return-it
export const mutationReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>,
): Promise<T> => {
  return (await mutation).raw[0];
};

export const verifyToken = async (token: string): Promise<AuthContext | undefined> => {
  if (!token) return;
  try {
    const { userId, exp } = verify(token, getEnv('SECRET_JWT')) as Required<JwtPayload> & {
      userId: string;
    };
    return {
      userId,
      exp,
      token,
    };
  } catch (error) {
    throw new GraphQLError('Invalid token');
  }
};
