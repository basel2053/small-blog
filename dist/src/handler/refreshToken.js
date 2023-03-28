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
const jsonwebtoken_1 = require('jsonwebtoken');
const ApiError_1 = __importDefault(require('../Error/ApiError'));
const user_1 = require('./../model/user');
const signToken_1 = __importDefault(require('../util/signToken'));
const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
  JWT_ACCESS_EXPIRY,
  JWT_SECRET,
} = process.env;
const store = new user_1.User();
const refreshToken = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      if (!req.cookies['refresh-token']) {
        return next(
          new ApiError_1.default(
            `You are not authorized to get such info, please login first`,
            401,
            'not authorized to get such a route',
            true
          )
        );
      }
      const jwtRefresh = req.cookies['refresh-token'];
      res.clearCookie('refresh-token', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const user = yield store.showByToken(jwtRefresh);
      // ! remember to remove the refresh token from the database (make it one time use only)
      if (!user) {
        (0, jsonwebtoken_1.verify)(
          jwtRefresh,
          JWT_REFRESH_SECRET,
          (err, payload) =>
            __awaiter(void 0, void 0, void 0, function* () {
              if (err) return res.sendStatus(403);
              // ? with the refresh token rotation here we know that invalid token (resuse attempt), so we delete all user tokens
              yield store.deleteRefreshToken(
                payload === null || payload === void 0
                  ? void 0
                  : payload.user.id
              );
            })
        );
        return next(
          new ApiError_1.default(
            `cannot be accessed`,
            403,
            'failed to fetch the user info',
            true
          )
        );
      }
      const newRefreshTokens =
        (_a = user.refreshtoken) === null || _a === void 0
          ? void 0
          : _a.filter((rt) => rt !== jwtRefresh);
      (0,
      jsonwebtoken_1.verify)(jwtRefresh, JWT_REFRESH_SECRET, (err, payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
          var _b;
          // ? HERE all good but expired token
          if (err) {
            yield store.storeToken(user.email, newRefreshTokens);
          }
          if (
            err ||
            ((_b =
              payload === null || payload === void 0
                ? void 0
                : payload.user) === null || _b === void 0
              ? void 0
              : _b.email) !== user.email
          )
            return res.sendStatus(403);
          //  ? now we have a valid token
          const accessToken = (0, signToken_1.default)(
            payload === null || payload === void 0 ? void 0 : payload.user,
            JWT_SECRET + '',
            JWT_ACCESS_EXPIRY + ''
          );
          const newRefreshToken = (0, signToken_1.default)(
            payload === null || payload === void 0 ? void 0 : payload.user,
            JWT_REFRESH_SECRET + '',
            JWT_REFRESH_EXPIRY + ''
          );
          yield store.storeToken(
            payload === null || payload === void 0
              ? void 0
              : payload.user.email,
            [...newRefreshTokens, newRefreshToken]
          );
          res.cookie('refresh-token', newRefreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
          });
          res.json({
            message: 'user token refreshed',
            name: user.name,
            id: user.id,
            accessToken,
          });
        })
      );
    } catch (err) {
      throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
    }
  });
const logout = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
      if (!req.cookies['refresh-token']) {
        return next(
          new ApiError_1.default(
            `You are not allowed do such an action, no token available.`,
            403,
            'not authorized to get such a route',
            true
          )
        );
      }
      const jwtRefresh = req.cookies['refresh-token'];
      res.clearCookie('refresh-token', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const user = yield store.showByToken(jwtRefresh);
      if (!user) {
        return next(
          new ApiError_1.default(
            `cannot be accessed`,
            404,
            'failed to fetch the user info',
            true
          )
        );
      }
      const newRefreshTokens =
        (_c = user.refreshtoken) === null || _c === void 0
          ? void 0
          : _c.filter((rt) => rt !== jwtRefresh);
      yield store.storeToken(user.email, [...newRefreshTokens]);
      // IMPORTANT  don't forget in production to set secure flag to true in production
      res.sendStatus(204);
    } catch (err) {
      throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
    }
  });
const refreshTokenRoute = (app) => {
  app.get('/token/refresh', refreshToken);
  app.get('/logout', logout);
};
exports.default = refreshTokenRoute;
