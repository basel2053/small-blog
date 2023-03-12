import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

const validation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()[0] });
    }
    next();
  } catch (err) {
    res.status(422).json({ error: err });
  }
};

export default validation;
