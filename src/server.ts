import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerDocument from '../swagger.json';
import userRoutes from './handler/user';
import postRoutes from './handler/post';

dotenv.config();

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use('/images', express.static('upload'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

userRoutes(app);
postRoutes(app);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  // const status = error.statusCode || 500;
  const message = error.message;
  // const data = error.data;
  // res.status(status).json({ message: message, data: data });
  res.json({ error: message });
});

app.listen(port, () => {
  console.log(`server is running up on http://localhost:${port}`);
});

export default app;
