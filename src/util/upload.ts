const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const cloud = cloudinary.v2;

cloud.config({
	cloud_name: 'name',
	api_key: 'key',
	api_secret: 'secret',
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloud,
	params: {
		public_id: (req, file) => `${file.originalname.split('.')[0]}-${Date.now()}`,
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(new ApiError('Only Images allowed', 400), false); // false if exist error (failed)
	}
};

const upload = multer({ storage: cloudStorage, fileFilter: fileFilter });
module.exports = upload;
