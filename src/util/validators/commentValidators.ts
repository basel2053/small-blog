import { body, param } from 'express-validator';

export const validateCommentCreate = () => {
  return [
    body('body', 'Invalid comment body')
      .notEmpty()
      .isLength({ min: 1, max: 400 }),
    body('postId', 'Must provide post id').notEmpty().isNumeric(),
  ];
};

export const validateCommentUpdate = () => {
  return [
    param('commentId').notEmpty().isNumeric(),
    body('body', 'Invalid comment body')
      .notEmpty()
      .isLength({ min: 1, max: 400 }),
  ];
};

export const validateCommentDelete = () => {
  return [param('commentId').notEmpty().isNumeric()];
};
