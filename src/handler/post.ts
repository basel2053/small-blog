import { Application, NextFunction, Request, Response } from 'express';
import { unlink } from 'fs/promises';

import { Post } from '../model/post';
import upload from '../util/upload';
import optimizeImage from '../middleware/optimizeImage';
import verifyToken from '../middleware/verifyToken';
import validation from '../middleware/validation';
import APIError from '../Error/ApiError';

import {
  validatePostCreate,
  validatePostDelete,
  validatePostUpdate,
} from '../util/validators/postValidators';

const store = new Post();

const postsPerPage = 6;

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const author = Number(req.query.author) || null;
    const posts = await store.index(author);
    res.json({ message: 'retrived posts sucessfully', data: posts });
  } catch (err) {
    throw new Error(`couldn't get posts, ${err}`);
  }
};

const filter = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const author = req.query.author as string | undefined;
    const query = (req.query.query as string) || '';
    const skip = (page - 1) * postsPerPage;
    const postsInfo = await store.filter(author, query, postsPerPage, skip);
    const postsCount = postsInfo.postsCount;
    const numberOfPages = Math.ceil(postsCount / postsPerPage);
    const next = page * postsPerPage < postsCount ? true : false;
    const prev = page > 1 ? true : false;
    res.status(200).json({
      message: 'retrived posts sucessfully',
      posts: postsInfo.posts,
      pagination: { postsCount, numberOfPages, page, next, prev },
    });
  } catch (err) {
    throw new Error(`couldn't get posts, ${err}`);
  }
};

const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await store.show(req.params.postId);
    if (!post.post) {
      return next(
        new APIError(
          `couldn't find post ${req.params.postId}`,
          404,
          'failed to find the post',
          true
        )
      );
    }
    res.status(200).json({
      message: 'retrived post sucessfully',
      post: post.post,
      comments: post.comments,
    });
  } catch (err) {
    res.sendStatus(404);
  }
};
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const author = res.locals.username;
    const post = await store.create({ ...req.body, author });
    res.status(201).json({ message: 'post created sucessfully', data: post });
  } catch (err) {
    throw new Error(`couldn't create post , ${err}`);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const post = await store.update(
      req.params.postId,
      req.body,
      res.locals.username
    );
    if (!post?.post) {
      return next(
        new APIError(
          `couldn't find post ${req.params.postId} to update`,
          404,
          'failed to find the post',
          true
        )
      );
    }
    if (req.body.image) {
      try {
        await unlink(post.image);
      } catch (err) {
        return res
          .status(500)
          .json({ warning: "Image wasn't deleted, path error", data: post });
      }
    }
    res.json({ message: 'post updated sucessfully', data: post.post });
  } catch (err) {
    throw new Error(`couldn't updated post , ${err}`);
  }
};
const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await store.delete(req.params.postId, res.locals.username);
    if (!post) {
      return next(
        new APIError(
          `couldn't find post ${req.params.postId} to delete`,
          404,
          'failed to find the post',
          true
        )
      );
    }
    await unlink(post.image);
    res.json({ message: 'posts deleted sucessfully', data: post });
  } catch (err) {
    throw new Error(`couldn't delete post , ${err}`);
  }
};

const postRoutes = (app: Application) => {
  app
    .route('/posts')
    .get(verifyToken, index)
    .post(
      verifyToken,
      upload.single('image'),
      validatePostCreate(),
      validation,
      optimizeImage,
      create
    );

  app
    .route('/posts/:postId')
    .get(verifyToken, show)
    .delete(verifyToken, validatePostDelete(), validation, remove)
    .patch(
      verifyToken,
      upload.single('image'),
      validatePostUpdate(),
      validation,
      optimizeImage,
      update
    );

  app.get('/filter', verifyToken, filter);
};

export default postRoutes;
