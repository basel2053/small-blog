import multer, { FileFilterCallback } from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';

const cloud = cloudinary.v2;

cloud.config({
	cloud_name: 'name',
	api_key: 'key',
	api_secret: 'secret',
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloud,
	params: {
		public_id: (_req: Request, file: Express.Multer.File) =>
			`${file.originalname.split('.')[0]}-${Date.now()}`,
	},
});
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
		// cb(new ApiError('Only Images allowed', 400), false); // false if exist error (failed)
	}
};

const upload = multer({ storage: cloudStorage, fileFilter: fileFilter });
export default upload;
