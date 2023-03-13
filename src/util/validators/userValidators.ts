import { body, param } from 'express-validator';

import { User } from '../../model/user';

export const validateUserCreate = () => {
  return [
    body('email', 'invalid email')
      .notEmpty()
      .isEmail()
      .custom(async (value: string) => {
        const user = await User.showByField(value, 'email');
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      }),
    body('password', 'Invalid password should be 6-16 characters')
      .isAlphanumeric()
      .isLength({ min: 6, max: 16 })
      .notEmpty()
      .custom((value: string, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    body('name', 'invalid name')
      .optional()
      .isAlphanumeric()
      .isLength({ min: 2, max: 40 }),
  ];
};

export const validateUserUpdate = () => {
  return [
    body('password', 'Invalid password should be 6-16 characters')
      .isAlphanumeric()
      .isLength({ min: 6, max: 16 })
      .notEmpty()
      .custom((value: string, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    param('id').notEmpty().isNumeric(),
  ];
};

export const validateUserAuthenticate = () => {
  return [
    body('email', 'invalid email').notEmpty().isEmail(),
    body('password', 'Invalid password should be 6-16 characters')
      .isAlphanumeric()
      .isLength({ min: 6, max: 16 })
      .notEmpty(),
  ];
};
