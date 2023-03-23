import { Application, Request, Response, NextFunction } from 'express';
import verifyToken from '../middleware/verifyToken';
import { Comment } from '../model/comment';
import { Post } from '../model/post';
import APIError from '../Error/ApiError';
import {
  validateCommentCreate,
  validateCommentDelete,
  validateCommentUpdate,
} from '../util/validators/commentValidators';

const store = new Comment();
const postStore = new Post();

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, postId } = req.body;
    const post = await postStore.showWithoutComments(postId);
    if (!post) {
      return next(
        new APIError(
          `The post ${postId} doesn't exists, to leave a comment on it`,
          404,
          'the user is trying to add a comment for a post which cannot be found.',
          true
        )
      );
    }
    const author = res.locals.username;
    const comment = await store.create(postId, author, body);
    res.status(201).send({ message: 'Comment created', comment });
  } catch (err) {
    res.sendStatus(400);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const comment = await store.show(+commentId);
    if (res.locals.username !== comment.author) {
      return next(
        new APIError(
          `You are not allowed to edit this comment`,
          403,
          'Only the comment creator can edit the comment.',
          true
        )
      );
    }
    await store.update(+commentId, body);
    res.status(200).send({ message: 'Comment is successfully edited' });
  } catch (err) {
    res.sendStatus(400);
  }
};

const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const comment = await store.show(+commentId);
    const post = await postStore.showWithoutComments(comment.postid + '');
    const user = res.locals.username;
    if (user !== comment.author && user !== post.author) {
      return next(
        new APIError(
          `You are not allowed to delete this comment`,
          403,
          'Only the comment creator or post author can delete the comment.',
          true
        )
      );
    }
    await store.delete(+commentId);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(400);
  }
};

const commentsRoutes = (app: Application) => {
  // NOTE  Ideally it would be better to make routes --> /posts/:postId/comments
  app.post('/comments', verifyToken, validateCommentCreate(), create);

  app
    .route('/comments/:commentId')
    .patch(verifyToken, validateCommentUpdate(), update)
    .delete(verifyToken, validateCommentDelete(), remove);
};

export default commentsRoutes;
