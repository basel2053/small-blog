import { body, param } from 'express-validator';

// NOTE   we can use oneOf in update if we only want to at least get 1 field

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
    body('title', 'Invalid title')
      .notEmpty()
      .isString()
      .isLength({ min: 3, max: 40 }),
    body('description', 'Invalid description').notEmpty().isLength({ min: 16 }),
  ];
};

export const validatePostDelete = () => {
  return [param('postId').notEmpty().isNumeric()];
};
