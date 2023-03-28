import { VerifyErrors, verify } from 'jsonwebtoken';
import APIError from '../Error/ApiError';
import { User } from './../model/user';
import { Application, NextFunction, Request, Response } from 'express';
import signToken from '../util/signToken';

const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
  JWT_ACCESS_EXPIRY,
  JWT_SECRET,
} = process.env;

const store = new User();

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
    res.clearCookie('refresh-token', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const user = await store.showByToken(jwtRefresh);
    // ! remember to remove the refresh token from the database (make it one time use only)

    if (!user) {
      verify(
        jwtRefresh,
        JWT_REFRESH_SECRET as string,
        async (err: VerifyErrors | null, payload: any) => {
          if (err) return res.sendStatus(403);
          // ? with the refresh token rotation here we know that invalid token (resuse attempt), so we delete all user tokens
          await store.deleteRefreshToken(payload?.user.id);
        }
      );
      return next(
        new APIError(
          `cannot be accessed`,
          403,
          'failed to fetch the user info',
          true
        )
      );
    }
    const newRefreshTokens = user.refreshtoken?.filter(
      (rt) => rt !== jwtRefresh
    ) as Array<string>;

    verify(
      jwtRefresh,
      JWT_REFRESH_SECRET as string,
      async (err: VerifyErrors | null, payload: any) => {
        // ? HERE all good but expired token
        if (err) {
          await store.storeToken(user.email, newRefreshTokens);
        }
        if (err || payload?.user?.email !== user.email)
          return res.sendStatus(403);

        //  ? now we have a valid token
        const accessToken = signToken(
          payload?.user,
          JWT_SECRET + '',
          JWT_ACCESS_EXPIRY + ''
        );
        const newRefreshToken = signToken(
          payload?.user,
          JWT_REFRESH_SECRET + '',
          JWT_REFRESH_EXPIRY + ''
        );

        await store.storeToken(payload?.user.email, [
          ...newRefreshTokens,
          newRefreshToken,
        ]);

        res.cookie('refresh-token', newRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'none',
          secure: true,
          domain: 'vercel.app',
        });
        res.json({
          message: 'user token refreshed',
          name: user.name,
          id: user.id,
          accessToken,
        });
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

    const user = await store.showByToken(jwtRefresh);
    if (!user) {
      return next(
        new APIError(
          `cannot be accessed`,
          404,
          'failed to fetch the user info',
          true
        )
      );
    }

    const newRefreshTokens = user.refreshtoken?.filter(
      (rt) => rt !== jwtRefresh
    ) as Array<string>;

    await store.storeToken(user.email, [...newRefreshTokens]);
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
