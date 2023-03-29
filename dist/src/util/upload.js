"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = __importDefault(require("../Error/ApiError"));
// import { v4 as uuidv4 } from 'uuid';
// type DestinationCallback = (error: Error | null, destination: string) => void;
// type FileNameCallback = (error: Error | null, filename: string) => void;
const fileFilter = (_req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.default('Only Images allowed', 415, 'cannot let the user upload other than images.', true));
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
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage, fileFilter: fileFilter });
exports.default = upload;
