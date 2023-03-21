import { Application, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
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
  validateUserForgetPassword,
} from '../util/validators/userValidators';
import { compare, hash } from 'bcrypt';
import mail from '../util/mailing';
import { Token } from '../model/token';
dotenv.config();

const store = new User();
const reset = new Token();

const {
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
  SR,
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
    const user = await store.show(req.params.author);
    res.json({
      message: 'retrived the user ',
      author: user,
    });
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
          `Invalid email or password`,
          404,
          'failed to authenticate the user',
          true
        )
      );
    }
    const { id, name } = user;
    const token = signToken(
      { id, name, email },
      JWT_SECRET + '',
      JWT_ACCESS_EXPIRY + ''
    );
    const refreshToken = signToken(
      { id, name, email },
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

      const foundToken = await store.showByToken(jwtCookie);
      if (!foundToken) {
        // ? now we are sure the token is deleted and was used before
        newRefreshTokens = [];
      }

      res.clearCookie('refresh-token', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    if (!newRefreshTokens) {
      newRefreshTokens = [];
    }
    await store.storeToken(email, [...newRefreshTokens, refreshToken]);
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ name: user.name, accessToken: token });
  } catch (err) {
    throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await store.validate(req.body.email);
    if (!user) {
      return next(
        new APIError(
          `User doesn't exist..`,
          404,
          'failed to authenticate the user',
          true
        )
      );
    }
    // ! important when user succesfully reset his password delete all of his refreshTokens
    const resetCode = Math.floor(100000 + Math.random() * 900000) + ''; // NOTE  ensuring first digit will never be 0
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = await hash(resetToken, Number(SR));
    const hashedCode = crypto
      .createHash('sha512')
      .update(resetCode)
      .digest('hex');
    await reset.createToken(hashedToken, hashedCode, user.id);
    // NOTE saved hashs will be later compared to see if we really got valid request or not, resetToken valid for 15min, check if verified
    const link = `http://localhost:5173/forgot?token=${resetToken}&id=${user.id}`;
    mail(user.email, 'Password Reset Request', link, user.name);
    res.status(200).send({ message: 'An E-mail has been sent.' });
  } catch (err) {
    // NOTE we may delete all info we saved if an error happened
    console.log(err);
  }
};

const checkResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, id } = req.params;
    const storedToken = await reset.getToken(id);

    if (!storedToken) {
      return next(
        new APIError(
          `Invalid or expired password reset token`,
          404,
          'failed to authenticate the user',
          true
        )
      );
    }

    if (
      !(await compare(token, storedToken.token)) ||
      crypto.createHash('sha512').update(req.body.code).digest('hex') !==
        storedToken.code
    ) {
      return next(
        new APIError(
          `Invalid or expired password reset token`,
          404,
          'failed to authenticate the user',
          true
        )
      );
    }

    await reset.verifiedCode(id);
    res.status(200).send({
      message:
        'The reset code has been verified you are ready to change the password',
    });
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    // HERE  verifying that the user indeed exists
    // const user = await store.getById(id);
    // if (!user) {
    //   return next(
    //     new APIError(
    //       `Cannot find the user with Id: ${id}`,
    //       404,
    //       'failed to get the user',
    //       true
    //     )
    //   );
    // }

    const storedToken = await reset.getToken(id);
    if (!storedToken?.verified) {
      return next(
        new APIError(
          `Password reset code is not verified you are not allowed to change password.`,
          403,
          'Not verified reset token',
          true
        )
      );
    }
    await store.update(id, password);
    await reset.removeToken(id);

    res
      .status(200)
      .send({ message: 'You changed your password successfully.' });
  } catch (err) {
    console.log(err);
  }
};

const userRoutes = (app: Application): void => {
  // ! Development purpose only
  app.get('/users', index);
  app.delete('/users/:id', remove);
  app.patch('/users/:id', validateUserUpdate(), validation, update);
  // HERE  . our used routes
  app.get('/users/:author', verifyToken, show);
  app.post('/users/signup', validateUserCreate(), validation, create);
  app.post(
    '/users/login',
    validateUserAuthenticate(),
    validation,
    authenticate
  );
  app.post(
    '/users/forgot-password',
    validateUserForgetPassword(),
    forgotPassword
  );
  app.post('/users/check-reset', checkResetCode);
  app.post('/user/reset-password', resetPassword);
};

export default userRoutes;
