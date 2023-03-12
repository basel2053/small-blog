import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import APIError from '../Error/ApiError';
// import { v4 as uuidv4 } from 'uuid';

// type DestinationCallback = (error: Error | null, destination: string) => void;
// type FileNameCallback = (error: Error | null, filename: string) => void;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(
      new APIError(
        'Only Images allowed',
        415,
        'cannot let the user upload other than images.',
        true
      )
    );
    // cb(new ApiError('Only Images allowed', 400), false); // false if exist error (failed)
  }
};

// const fileStorage = multer.diskStorage({
//   destination: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: DestinationCallback
//   ) {
//     cb(null, '/upload');
//   },
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileNameCallback
//   ) {
//     cb(null, uuidv4() + '-' + file.originalname);
//   },
// });

// NOTE  need to pass buffer to sharp though use memoryStorage
const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter: fileFilter });
export default upload;
