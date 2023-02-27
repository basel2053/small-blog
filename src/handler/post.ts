import { Application, Request, Response } from 'express';
import { Post } from '../model/post';
import upload from '../util/upload';

const store = new Post();

const index = async (_req: Request, res: Response): Promise<void> => {
	try {
		const posts = await store.index();
		res.json({ message: 'retrived posts sucessfully', data: posts });
	} catch (err) {
		throw new Error(`couldn't get posts, ${err}`);
	}
};
const show = async (req: Request, res: Response): Promise<void> => {
	try {
		const post = await store.show(req.params.postId);
		res.json({ message: 'retrived posts sucessfully', data: post });
	} catch (err) {
		throw new Error(`couldn't get the post ${req.params.postId}, ${err}`);
	}
};
const create = async (req: Request, res: Response): Promise<void> => {
	try {
		// validation middleware
		const post = await store.create(req.body);
		res.json({ message: 'posts created sucessfully', data: post });
	} catch (err) {
		throw new Error(`couldn't create post , ${err}`);
	}
};

const update = async (req: Request, res: Response): Promise<void> => {
	try {
		// validation middleware
		const post = await store.update(req.params.postId, req.body.password);
		res.json({ message: 'posts updated sucessfully', data: post });
	} catch (err) {
		throw new Error(`couldn't updated post , ${err}`);
	}
};
const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		const post = await store.delete(req.params.postId);
		res.json({ message: 'posts deleted sucessfully', data: post });
	} catch (err) {
		throw new Error(`couldn't delete post , ${err}`);
	}
};

const postRoutes = (app: Application) => {
	app.get('/posts', index);
	app.get('/posts/:postId', show);
	app.post('/posts', upload.single('image'), create);
	app.delete('/posts/:postId', remove);
	app.patch('/posts/:postId', upload.single('image'), update);
};

export default postRoutes;
