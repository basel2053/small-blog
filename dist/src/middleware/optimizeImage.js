'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sharp_1 = __importDefault(require('sharp'));
const uuid_1 = require('uuid');
const optimizeImage = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.file && req.method === 'PATCH') {
      return next();
    }
    const folder = process.env.ENV === 'TEST' ? 'test_upload' : 'uploads';
    const path = `${folder}/${(0, uuid_1.v4)()} - ${
      (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname
    }`;
    try {
      yield (0, sharp_1.default)(
        (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer
      )
        .resize(600, 400)
        .toFile(path);
      // NOTE  may optimize quality or extension later
      req.body.image = path;
      next();
    } catch (err) {
      res.status(400).json({
        error: "Couldn't optimize the image, The post must have an image.",
      });
    }
  });
exports.default = optimizeImage;
