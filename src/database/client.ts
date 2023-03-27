import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// const { PG_HOST, PG_DB, PG_TEST_DB, PG_USER, PG_PASSWORD, ENV } = process.env;

// const Client = new Pool({
//   host: PG_HOST,
//   database: ENV === 'TEST' ? PG_TEST_DB : PG_DB,
//   user: PG_USER,
//   password: PG_PASSWORD,
// });

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const Client = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  application_name: ENDPOINT_ID,
  ssl: true,
});

export default Client;
