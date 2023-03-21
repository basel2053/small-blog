import { body, param } from 'express-validator';

// NOTE   we can use oneOf in update if we only want to at least get 1 field

export const validatePostCreate = () => {
  return [
    body('title', 'Invalid title')
      .notEmpty()
      .isString()
      .isLength({ min: 3, max: 50 }),
    body('description', 'Invalid description').notEmpty().isLength({ min: 16 }),
    body('field', 'Invalid field').isIn([
      'Web Programming',
      'Embedded System',
      'Cyber Security',
      'Mobile Development',
      'DevOps',
      'Cloud Architect',
      'Software Testing',
      'Data Analytics & Visualization',
      'UI/UX',
      'System Admin',
    ]),
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
