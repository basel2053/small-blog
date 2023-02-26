import Client from '../database/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { PEPPER, SR } = process.env;

export type TUser = {
	id?: number;
	email: string;
	password: string;
	name: string;
	age: number;
};

export class User {
	async index(): Promise<TUser[]> {
		try {
			const conn = await Client.connect();
			const sql = 'SELECT email,name,age FROM users';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Cannot get users ${err}`);
		}
	}
	async show(id: string): Promise<TUser> {
		try {
			const conn = await Client.connect();
			const sql = 'SELECT email,name,age FROM users WHERE id=$1';
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Cannot get user ${id}, ${err}`);
		}
	}
	async update(id: string, password: string): Promise<TUser> {
		try {
			const conn = await Client.connect();
			const sql = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING *';
			const hashedPassword = await bcrypt.hash(password + PEPPER, Number(SR));
			const result = await conn.query(sql, [hashedPassword, id]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Cannot update user ${id}, ${err}`);
		}
	}
	async delete(id: string): Promise<TUser> {
		try {
			const conn = await Client.connect();
			const sql = 'DELETE FROM users WHERE id=$1 RETURNING *';
			const result = await conn.query(sql, [id]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Cannot delete user ${id}, ${err}`);
		}
	}
	async create(user: TUser): Promise<TUser> {
		try {
			const conn = await Client.connect();
			const sql =
				'INSERT INTO users(email,password,name,age) VALUES ($1,$2,$3,$4) RETURNING *';
			const hashedPassword = await bcrypt.hash(
				user.password + PEPPER,
				Number(SR)
			);
			const result = await conn.query(sql, [
				user.email,
				hashedPassword,
				user.name,
				user.age,
			]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Cannot create user ${user.name} , ${err}`);
		}
	}
	async authenticate(email: string, password: string): Promise<TUser | null> {
		try {
			const conn = await Client.connect();
			const sql = 'SELECT * FROM users WHERE email=$1';
			const result = await conn.query(sql, [email]);
			conn.release();
			if (result.rows.length) {
				const user = result.rows[0];
				const isValid = await bcrypt.compare(password + PEPPER, user.password);
				if (isValid) {
					return user;
				}
			}
			return null;
		} catch (err) {
			throw new Error(`Cannot Find user ${email}, ${err}`);
		}
	}
}
