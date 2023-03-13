import { TUser } from '../model/user';

export interface IPayload {
  user: TUser;
  iat: number;
  exp: number;
}
