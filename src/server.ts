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

dotenv.config();

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.WHITE_LISTED,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use('/images', express.static('upload'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

userRoutes(app);
postRoutes(app);

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
