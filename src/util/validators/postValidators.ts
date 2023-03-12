import { body, param, oneOf } from 'express-validator';

export const validatePostCreate = () => {
  return [
    body('title', 'invalid title')
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 3, max: 40 }),
    body('description', 'invalid description').notEmpty().isLength({ min: 20 }),
  ];
};

export const validatePostUpdate = () => {
  return [
    param('postId').notEmpty().isNumeric(),
    oneOf([
      body('title', 'invalid title')
        .exists()
        .isAlphanumeric()
        .isLength({ min: 3, max: 40 }),
      body('description', 'invalid description').exists().isLength({ min: 20 }),
    ]),
  ];
};

export const validatePostDelete = () => {
  return [param('postId').notEmpty().isNumeric()];
};
