import { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { decode } from 'jsonwebtoken';
import { User } from '../model/user';
import signToken from '../util/signToken';

dotenv.config();

const {
  GOOGLE_AUTH_CLIENTID,
  GOOGLE_AUTH_SECRET,
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} = process.env;

const store = new User();

const oAuth2Client = new OAuth2Client(
  GOOGLE_AUTH_CLIENTID,
  GOOGLE_AUTH_SECRET,
  'postmessage'
);

const googleAuth = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { code } = req.body;
    const { tokens } = await oAuth2Client.getToken(code);
    const payload = decode(tokens.id_token + '') as {
      email: string;
      given_name: string;
      family_name: string;
    };
    let user = await store.validate(payload.email);
    if (!user) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      user = await store.googleAuthRegister(
        payload.email,
        `${payload.given_name} ${payload.family_name}#${randomNumber}`
      );
    }
    // NOTE  we may check if user has a cookie, so we replace it
    const { id, name, email } = user;
    const token = signToken(
      { id, name, email },
      JWT_SECRET + '',
      JWT_ACCESS_EXPIRY + ''
    );
    const refreshToken = signToken(
      { id, name, email },
      JWT_REFRESH_SECRET + '',
      JWT_REFRESH_EXPIRY + ''
    );
    if (!user.refreshtoken) {
      user.refreshtoken = [];
    }
    await store.storeToken(email, [...user.refreshtoken, refreshToken]);
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ name: user.name, accessToken: token });
  } catch (err) {
    res.sendStatus(500);
  }
};

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

const oauth2Routes = (app: Application) => {
  app.post('/users/oauth2/google', googleAuth);
  // app.post('/users/oauth2/google/refresh', googleAuthRefresh);
};

export default oauth2Routes;
