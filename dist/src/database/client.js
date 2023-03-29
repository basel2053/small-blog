"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const { PG_HOST, PG_DB, PG_TEST_DB, PG_USER, PG_PASSWORD, ENV } = process.env;
// const Client = new Pool({
//   host: PG_HOST,
//   database: ENV === 'TEST' ? PG_TEST_DB : PG_DB,
//   user: PG_USER,
//   password: PG_PASSWORD,
// });
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const Client = new pg_1.Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    application_name: ENDPOINT_ID,
    ssl: true,
});
exports.default = Client;
