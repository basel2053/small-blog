import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TUser } from '../model/user';
dotenv.config();

const signToken = (user: TUser) => {
	const token = sign({ user }, process.env.JWT_SECRET as string);
	return token;
};

export default signToken;
