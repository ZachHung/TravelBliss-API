import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import dotenv from 'dotenv';

export const dotenvInit = (): void => {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
};

export const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }
  return value;
};

// Credit: https://stackoverflow.com/questions/47792808/typeorm-update-item-and-return-it
export const mutationReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>,
): Promise<T> => {
  return (await mutation).raw[0];
};
