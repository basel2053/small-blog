import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

const optimizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file && req.method === 'PATCH') {
    return next();
  }
  try {
    await sharp(req.file?.buffer)
      .resize(600, 400)
      .toBuffer()
      .then(async (img) => {
        fetch(
          `https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'image/webp' },
            body: img,
          }
        )
          .then((r) => r.json())
          .then((r) => {
            req.body.image = r.url;
          });
      });

    next();
  } catch (err) {
    res.status(400).json({
      error: "Couldn't optimize the image, The post must have an image.",
    });
  }
};

export default optimizeImage;
