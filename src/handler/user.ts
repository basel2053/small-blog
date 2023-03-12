import { Application, Request, Response } from 'express';
import { User } from '../model/user';
import signToken from '../util/signToken';
import validation from '../middleware/validation';
import userValidator from '../util/validators/userValidators';
import dotenv from 'dotenv';
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

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.update(req.params.id, req.body.password);
    res.json({ message: 'updated the user ', data: user });
  } catch (err) {
    throw new Error(`couldn't update user,${req.params.id} , ${err}`);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // validation middleware
    const user = await store.create(req.body);

    res.json({ message: 'user created', user });
  } catch (err) {
    throw new Error(`couldn't find user,${req.params.id} , ${err}`);
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.authenticate(req.body.email, req.body.password);
    if (!user) {
      throw new Error(`cannot authenticate user ${req.body.email}`);
    }
    const token = signToken(user, JWT_SECRET + '', JWT_ACCESS_EXPIRY + '');
    const refreshToken = signToken(
      user,
      JWT_REFRESH_SECRET + '',
      JWT_REFRESH_EXPIRY + ''
    );

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'user signed in', accessToken: token });
  } catch (err) {
    throw new Error(`couldn't find user,${req.params.id} , ${err}`);
  }
};

const userRoutes = (app: Application): void => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.delete('/users/:id', remove);
  app.patch('/users/:id', validation(userValidator), update);
  app.post('/signup', validation(userValidator), create);
  app.post('/login', validation(userValidator), authenticate);
};

export default userRoutes;
