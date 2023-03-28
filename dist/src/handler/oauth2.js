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
const dotenv_1 = __importDefault(require('dotenv'));
const google_auth_library_1 = require('google-auth-library');
const jsonwebtoken_1 = require('jsonwebtoken');
const user_1 = require('../model/user');
const signToken_1 = __importDefault(require('../util/signToken'));
dotenv_1.default.config();
const {
  GOOGLE_AUTH_CLIENTID,
  GOOGLE_AUTH_SECRET,
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} = process.env;
const store = new user_1.User();
const oAuth2Client = new google_auth_library_1.OAuth2Client(
  GOOGLE_AUTH_CLIENTID,
  GOOGLE_AUTH_SECRET,
  'postmessage'
);
const googleAuth = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { code } = req.body;
      const { tokens } = yield oAuth2Client.getToken(code);
      const payload = (0, jsonwebtoken_1.decode)(tokens.id_token + '');
      let user = yield store.validate(payload.email);
      if (!user) {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        user = yield store.googleAuthRegister(
          payload.email,
          `${payload.given_name} ${payload.family_name}${randomNumber}`
        );
      }
      // NOTE  we may check if user has a cookie, so we replace it
      const { id, name, email } = user;
      const token = (0, signToken_1.default)(
        { id, name, email },
        JWT_SECRET + '',
        JWT_ACCESS_EXPIRY + ''
      );
      const refreshToken = (0, signToken_1.default)(
        { id, name, email },
        JWT_REFRESH_SECRET + '',
        JWT_REFRESH_EXPIRY + ''
      );
      if (!user.refreshtoken) {
        user.refreshtoken = [];
      }
      yield store.storeToken(email, [...user.refreshtoken, refreshToken]);
      res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ name: user.name, id: user.id, accessToken: token });
    } catch (err) {
      res.sendStatus(500);
    }
  });
// IMPORTANT  if we want to use oAuth2 for authorization this would be useful
// const googleAuthRefresh = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user = new UserRefreshClient(
//       GOOGLE_AUTH_CLIENTID,
//       GOOGLE_AUTH_SECRET,
//       req.body.refreshToken
//     );
//     const { credentials } = await user.refreshAccessToken(); // optain new tokens
//     res.json(credentials);
//   } catch (err) {
//     console.log(err);
//   }
// };
const oauth2Routes = (app) => {
  app.post('/users/oauth2/google', googleAuth);
  // app.post('/users/oauth2/google/refresh', googleAuthRefresh);
};
exports.default = oauth2Routes;
