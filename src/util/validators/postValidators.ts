import { body, param, oneOf } from 'express-validator';

export const validatePostCreate = () => {
  return [
    body('title', 'Invalid title')
      .notEmpty()
      .isString()
      .isLength({ min: 3, max: 40 }),
    body('description', 'Invalid description').notEmpty().isLength({ min: 16 }),
  ];
};

export const validatePostUpdate = () => {
  return [
    param('postId').notEmpty().isNumeric(),
    oneOf([
      body('title', 'invalid title')
        .exists()
        .isString()
        .isLength({ min: 3, max: 40 }),
      body('description', 'invalid description').exists().isLength({ min: 20 }),
    ]),
  ];
};

export const validatePostDelete = () => {
  return [param('postId').notEmpty().isNumeric()];
};
