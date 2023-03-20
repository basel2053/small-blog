import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import swaggerDocument from '../swagger.json';
import userRoutes from './handler/user';
import postRoutes from './handler/post';
import APIError from './Error/ApiError';
import refreshTokenRoute from './handler/refreshToken';

dotenv.config();

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', true as any);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

userRoutes(app);
postRoutes(app);
refreshTokenRoute(app);

app.all('*', (req, res, next) => {
  next(
    new APIError(
      `Couldn't find such a route visit ${req.baseUrl}/api-docs to get more info`,
      404,
      "this route couldn't be found",
      true
    )
  );
});

app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
  const message = error.name;
  res.status(error.statusCode).json({ error: message });
});

app.listen(port, () => {
  console.log(`server is running up on http://localhost:${port}`);
});

export default app;
