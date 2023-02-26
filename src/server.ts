import express from 'express';

const app: express.Application = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`server is running up on http://localhost:${port}`);
});
