import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const optimizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const path = `uploads/${uuidv4()} - ${req.file?.originalname}.${
    req.file?.mimetype.split('/')[1]
  }`;
  try {
    await sharp(req.file?.buffer).resize(600, 600).toFile(path);
    // NOTE  may optimize quality or extension later
    req.body.image = path;
    next();
  } catch (err) {
    res.status(400).json({
      error: "Couldn't optimize the image, The post must have an image.",
    });
  }
};

export default optimizeImage;
