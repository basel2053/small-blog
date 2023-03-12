import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as string;
  try {
    const user = verify(token, process.env.JWT_SECRET as string);
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie('auth-token');
    throw new Error(`not authenticated`);
  }
};

export default verifyToken;
