import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const cookieToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies['auth-token'];
	try {
		const user = verify(token, process.env.JWT_SECRET as string);
		res.locals.user = user;
		next();
	} catch (err) {
		res.clearCookie('auth-token');
		throw new Error(`not authenticated`);
	}
};

export default cookieToken;
