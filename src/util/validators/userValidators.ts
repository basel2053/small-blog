import { body, param, query } from 'express-validator';

import { User } from '../../model/user';

const store = new User();

// email or name

export const validateUserCreate = () => {
  return [
    body('email', 'Please provide a valid email.')
      .notEmpty()
      .isEmail()
      .custom(async (value: string, { req }) => {
        const user = await store.validate(value, req.body.name);
        if (user) {
          return Promise.reject('E-mail and Username must be unique.');
        }
        // NOTE  to check whether the email is invalid or name ---> we can check if (value === user.email) or (req.body.name === user.name)
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
    body('name', 'Invalid username should be at least 2 characters')
      .isString()
      .isLength({ min: 2, max: 40 }),
  ];
};

export const validateUserUpdate = () => {
  return [
    // body('password', 'Invalid password should be 6-16 characters')
    //   .isAlphanumeric()
    //   .isLength({ min: 6, max: 16 })
    //   .notEmpty()
    //   .custom((value: string, { req }) => {
    //     if (value !== req.body.confirmPassword) {
    //       throw new Error('Password confirmation does not match password');
    //     }
    //     return true;
    //   }),
    body('bio', 'Invalid Bio')
      .isString()
      .isLength({ min: 1, max: 100 })
      .notEmpty(),
    param('id').notEmpty().isNumeric(),
  ];
};

export const validateUserAuthenticate = () => {
  return [
    body('email', 'Please provide a valid email.').notEmpty().isEmail(),
    body('password', 'Invalid password should be 6-16 characters')
      .isAlphanumeric()
      .isLength({ min: 6, max: 16 })
      .notEmpty(),
  ];
};

export const validateUserForgetPassword = () => {
  return [body('email', 'Please provide a valid email.').notEmpty().isEmail()];
};

export const validateUserCheckReset = () => {
  return [
    body('code', 'Please provide a valid email.')
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 6, max: 6 }),
    query('token').notEmpty().isString(),
    query('id').notEmpty().isString(),
  ];
};

export const validateUserResetPassword = () => {
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
    query('id').notEmpty().isString(),
  ];
};
