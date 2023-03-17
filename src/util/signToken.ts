import { sign } from 'jsonwebtoken';
import { TUser } from '../model/user';

const signToken = (user: Partial<TUser>, secret: string, expiry: string) => {
  // NOTE  providing a cb at end makes it async
  const token = sign({ user }, secret, {
    expiresIn: expiry,
  });
  return token;
};

export default signToken;
