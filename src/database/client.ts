import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { PG_HOST, PG_DB, PG_USER, PG_PASSWORD } = process.env;

const Client = new Pool({
	host: PG_HOST,
	database: PG_DB,
	user: PG_USER,
	password: PG_PASSWORD,
});

export default Client;
