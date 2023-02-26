import { Application, Request, Response } from 'express';
import { User } from '../model/user';
import signToken from '../util/signToken';

const store = new User();

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
		const token = signToken(user);
		res.cookie('auth-token', token, {
			httpOnly: true,
			// secure:true,
			// maxAge:100000,
			// signed:true
		});
		res.json({ message: 'user signed in' });
	} catch (err) {
		throw new Error(`couldn't find user,${req.params.id} , ${err}`);
	}
};

const userRoutes = (app: Application): void => {
	app.get('/users', index);
	app.get('/users/:id', show);
	app.delete('/users/:id', remove);
};

export default userRoutes;
