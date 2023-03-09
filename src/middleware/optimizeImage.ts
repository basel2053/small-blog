import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const optimizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sharp(req.file?.buffer)
      .resize(600, 600)
      .toFile(`../../upload/${uuidv4()} - ${req.file?.filename}`);
    // NOTE  may optimize quality or extension later
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export default optimizeImage;
