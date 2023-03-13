import { Application, Request, Response, NextFunction } from 'express';
import { User } from '../model/user';
import signToken from '../util/signToken';
import validation from '../middleware/validation';
import verifyToken from '../middleware/verifyToken';

import APIError from '../Error/ApiError';

import dotenv from 'dotenv';
import {
  validateUserUpdate,
  validateUserCreate,
  validateUserAuthenticate,
} from '../util/validators/userValidators';
dotenv.config();

const store = new User();

const {
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} = process.env;

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json({ message: 'retrived users sucessfully', data: users });
  } catch (err) {
    throw new Error(`couldn't get users, ${err}`);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(req.params.id);
    res.json({ message: 'retrived the user ', data: user });
  } catch (err) {
    throw new Error(`couldn't find user,${req.params.id} , ${err}`);
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.delete(req.params.id);
    res.json({ message: ' the user is deleted', data: user });
  } catch (err) {
    throw new Error(`couldn't delete user,${req.params.id} , ${err}`);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await store.update(req.params.id, req.body.password);
  if (!user) {
    return next(
      new APIError(
        `couldn't update user ${req.params.id}`,
        422,
        'failed while trying to update the user',
        true
      )
    );
  }
  res.json({ message: 'updated the user ', data: user });
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // validation middleware
  const user = await store.create(req.body);
  if (!user) {
    return next(
      new APIError(
        `couldn't update user ${req.params.id}`,
        404,
        'failed while trying to update the user',
        true
      )
    );
  }
  res.status(201).json({ message: 'user created', user });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jwtCookie = req.cookies['refresh-token'];
    const { email, password } = req.body;
    const user = await store.authenticate(email, password);
    if (!user) {
      return next(
        new APIError(
          `cannot authenticate user ${email}`,
          404,
          'failed to authenticate the user',
          true
        )
      );
    }
    const token = signToken(user, JWT_SECRET + '', JWT_ACCESS_EXPIRY + '');
    const refreshToken = signToken(
      user,
      JWT_REFRESH_SECRET + '',
      JWT_REFRESH_EXPIRY + ''
    );

    // ? remove the old token if exists in cookie
    let newRefreshTokens = (
      !jwtCookie
        ? user.refreshtoken
        : user.refreshtoken?.filter((rt) => rt !== jwtCookie)
    ) as Array<string>;

    if (jwtCookie) {
      // ! if user logs in, never logs out or use RT (we must check for reuse detection so same refresh token not used in 2 logins or more)
      const jwtRefresh = jwtCookie;
      const foundToken = await store.showByField(jwtRefresh, 'refreshtoken');
      if (!foundToken) {
        // ? now we are sure the token is deleted and was used before
        newRefreshTokens = [];
      }
      res.clearCookie('refresh-token', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    await store.storeToken(email, [...newRefreshTokens, refreshToken]);

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'user signed in', accessToken: token });
  } catch (err) {
    throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
  }
};

const userRoutes = (app: Application): void => {
  // ! Development purpose only
  app.get('/users', index);
  app.delete('/users/:id', remove);
  app.patch('/users/:id', validateUserUpdate(), validation, update);
  // HERE  . our used routes
  app.get('/users/:id', verifyToken, show);
  app.post('/users/signup', validateUserCreate(), validation, create);
  app.post(
    '/users/login',
    validateUserAuthenticate(),
    validation,
    authenticate
  );
};

export default userRoutes;
