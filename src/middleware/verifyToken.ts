import { IPayload } from './../interface/payload';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No token was provided' });
    }
    const token = req.headers.authorization?.split(' ')[1] as string;
    const payload = verify(token, process.env.JWT_SECRET as string) as IPayload;

    res.locals.userId = payload.user.id;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token invalid or expired' });
  }
};

export default verifyToken;
