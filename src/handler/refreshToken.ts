import { VerifyErrors, verify } from 'jsonwebtoken';
import APIError from '../Error/ApiError';
import { User } from './../model/user';
import { Application, NextFunction, Request, Response } from 'express';
import signToken from '../util/signToken';

const { JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRY, JWT_SECRET } = process.env;

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.cookies['refresh-token']) {
      return next(
        new APIError(
          `You are not authorized to get such info, please login first`,
          401,
          'not authorized to get such a route',
          true
        )
      );
    }
    const jwtRefresh = req.cookies['refresh-token'];
    const user = await User.showByField(jwtRefresh, 'refreshtoken');
    // ! remember to remove the refresh token from the database (make it one time use only)
    if (!user) {
      return next(
        new APIError(
          `cannot be accessed`,
          403,
          'failed to fetch the user info',
          true
        )
      );
    }
    verify(
      jwtRefresh,
      JWT_REFRESH_SECRET as string,
      (err: VerifyErrors | null, payload: any) => {
        if (err || payload?.user?.email !== user.email)
          return res.sendStatus(403);

        const accessToken = signToken(
          payload?.user,
          JWT_SECRET + '',
          JWT_ACCESS_EXPIRY + ''
        );
        res.json({ message: 'user token refreshed', accessToken });
      }
    );
  } catch (err) {
    throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
  }
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.cookies['refresh-token']) {
      return next(
        new APIError(
          `You are not allowed do such an action, no token available.`,
          403,
          'not authorized to get such a route',
          true
        )
      );
    }
    const jwtRefresh = req.cookies['refresh-token'];
    res.clearCookie('refresh-token', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const user = await User.showByField(jwtRefresh, 'refreshtoken');
    if (!user) {
      return next(
        new APIError(
          `cannot be accessed`,
          204,
          'failed to fetch the user info',
          true
        )
      );
    }
    await User.deleteRefreshToken(user.id + '');
    // IMPORTANT  don't forget in production to set secure flag to true in production
    res.sendStatus(204);
  } catch (err) {
    throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
  }
};

const refreshTokenRoute = (app: Application): void => {
  app.get('/token/refresh', refreshToken);
  app.get('/logout', logout);
};

export default refreshTokenRoute;
