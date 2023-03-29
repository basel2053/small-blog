import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.KIT_PUBLIC + '',
  privateKey: process.env.KIT_PRIVATE + '',
  urlEndpoint: process.env.KIT_URL + '',
});

const optimizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file && req.method === 'PATCH') {
    return next();
  }
  try {
    const filename = `${uuidv4()}-${Date.now()}`;

    sharp(req.file?.buffer)
      .resize(600, 400)
      .toBuffer()
      .then(async (img) => {
        imagekit.upload({
          file: img,
          fileName: filename,
          useUniqueFileName: false,
        });
      });
    req.body.image = `${process.env.KIT_URL}/${filename}`;
    next();
  } catch (err) {
    res.status(400).json({
      error: "Couldn't optimize the image, The post must have an image.",
    });
  }
};

export default optimizeImage;
