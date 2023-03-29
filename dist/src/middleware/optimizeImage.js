"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const optimizeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file && req.method === 'PATCH') {
        return next();
    }
    try {
        yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
            .resize(600, 400)
            .toBuffer()
            .then((img) => __awaiter(void 0, void 0, void 0, function* () {
            fetch(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'image/webp' },
                body: img,
            })
                .then((r) => r.json())
                .then((r) => {
                req.body.image = r.url;
            });
        }));
        next();
    }
    catch (err) {
        res.status(400).json({
            error: "Couldn't optimize the image, The post must have an image.",
        });
    }
});
exports.default = optimizeImage;
