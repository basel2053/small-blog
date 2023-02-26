import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());

app.listen(port, () => {
	console.log(`server is running up on http://localhost:${port}`);
});

export default app;

// NOTE  const token = req.cookies['auth-token']; reading cookie
// res.clearCookie('key')
