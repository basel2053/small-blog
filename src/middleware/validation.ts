import APIError from '../Error/ApiError';
import { NextFunction, Request, Response } from 'express';

const validation =
  (validator: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const field = validator(req.body);
      if (field) {
        throw new APIError(
          `Input ${field} is invalid`,
          422,
          `invalid feild ${field} has been submitted to user route `,
          true
        );
      }
      next();
    } catch (err) {
      res.status(422).json({ error: err });
    }
  };

export default validation;
