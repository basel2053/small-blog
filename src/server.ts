import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerDocument from '../swagger.json';
import userRoutes from './handler/user';

dotenv.config();

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

userRoutes(app);

app.listen(port, () => {
	console.log(`server is running up on http://localhost:${port}`);
});

export default app;

// NOTE  const token = req.cookies['auth-token']; reading cookie
// res.clearCookie('key')
