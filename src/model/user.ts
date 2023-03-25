import Client from '../database/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { TPost } from './post';

dotenv.config();
const { PEPPER, SR } = process.env;

export type TUser = {
  id?: number;
  email: string;
  password: string;
  name?: string;
  confirmed?: boolean;
  refreshtoken?: string[];
};

export class User {
  async index(): Promise<TUser[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT email,name FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users ${err}`);
    }
  }

  async show(author: string): Promise<{ author: TUser; posts: TPost[] }> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE name=$1';
      const result = await conn.query(sql, [author]);
      const sql2 =
        'SELECT * FROM posts p WHERE author=$1 ORDER BY p.id DESC LIMIT 6';
      const result2 = await conn.query(sql2, [author]);
      conn.release();
      return { author: result.rows[0], posts: result2.rows };
    } catch (err) {
      throw new Error(`Cannot get user ${author}, ${err}`);
    }
  }

  async getById(id: string): Promise<TUser> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get user ${id}, ${err}`);
    }
  }

  async update(id: string, password: string): Promise<TUser | undefined> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET password=$1,refreshtoken=$2 WHERE id=$3 RETURNING *';
      const hashedPassword = await bcrypt.hash(password + PEPPER, Number(SR));
      const result = await conn.query(sql, [hashedPassword, [], id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(`Cannot get user ${id}, ${err}`);
    }
  }

  async confirmUser(id: string): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE users SET confirmed=TRUE WHERE id=$1';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      console.log(`Couldn't confirm user ${id}, ${err}`);
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
        'INSERT INTO users(email,password,name) VALUES ($1,$2,$3) RETURNING email,name,id';
      const hashedPassword = await bcrypt.hash(
        user.password + PEPPER,
        Number(SR)
      );
      const result = await conn.query(sql, [
        user.email,
        hashedPassword,
        user.name,
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
        if (await bcrypt.compare(password + PEPPER, user.password)) {
          const { password: pwd, ...info } = user;
          return info;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot Find user ${email}, ${err}`);
    }
  }

  // ? for validation purpose
  async validate(email: string, name?: string): Promise<TUser> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT id,name,email,refreshtoken FROM users WHERE email=$1 ${
        name ? `OR name='${name + ''}'` : ''
      }`;
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot Find user ${email}, ${err}`);
    }
  }

  // ? for checking if user got fresh token or not
  async showByToken(value: string): Promise<TUser> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM users WHERE $1=ANY(refreshToken)`;
      const result = await conn.query(sql, [value]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot Find user ${value}, ${err}`);
    }
  }

  // ? for removing the refresh token on logout
  async deleteRefreshToken(id: string): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = `UPDATE users SET refreshToken=NULL WHERE id=$1`;
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot Find user ${id}, ${err}`);
    }
  }

  async storeToken(email: string, token: string[]): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE users SET refreshToken=$1 WHERE email=$2';
      await conn.query(sql, [token, email]);
      conn.release();
    } catch (err) {
      throw new Error(`Couldn't insert user ${email} refresh token, ${err}`);
    }
  }

  async googleAuthRegister(email: string, name: string): Promise<TUser> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users(email,name,confirmed) VALUES ($1,$2,TRUE) RETURNING email,name,id';
      const result = await conn.query(sql, [email, name]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create user ${name} , ${err}`);
    }
  }
}
