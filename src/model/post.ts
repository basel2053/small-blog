import Client from '../database/client';

export type TPost = {
  id?: number;
  title: string;
  description: string;
  image: string;
  userId: number;
};

export class Post {
  async index(): Promise<TPost[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM posts';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get posts ${err}`);
    }
  }

  async show(id: string): Promise<TPost> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get post ${id}, ${err}`);
    }
  }

  async update(id: string, password: string): Promise<TPost> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE posts SET password=$1 WHERE id=$2 RETURNING *';
      const result = await conn.query(sql, [password, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update post ${id}, ${err}`);
    }
  }

  async delete(id: string): Promise<TPost> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM posts WHERE id=$1 RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete post ${id}, ${err}`);
    }
  }

  async create(post: TPost): Promise<TPost> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO posts(title,description,image,user_id) VALUES ($1,$2,$3,$4) RETURNING *';
      const result = await conn.query(sql, [
        post.title,
        post.description,
        post.image,
        post.userId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create post `);
    }
  }
}
