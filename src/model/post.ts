import Client from '../database/client';

export type TPost = {
  id?: number;
  title: string;
  description: string;
  image: string;
  userId: number;
};

export class Post {
  async index(author: number | null): Promise<TPost[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM posts ${
        author ? 'WHERE user_id=' + author : ''
      }`;
      console.log(sql);
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

  async update(id: string, post: TPost, userId: number): Promise<TPost | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT user_id,image FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      if (!result.rows[0] || result.rows[0].user_id !== userId) {
        conn.release();
        return null;
      }
      const sql2 =
        'UPDATE posts SET title=$1,description=$2,image=$3 WHERE id=$4 RETURNING *';
      const result2 = await conn.query(sql2, [
        post.title,
        post.description,
        post.image ? post.image : result.rows[0].image,
        id,
      ]);
      conn.release();
      return result2.rows[0];
    } catch (err) {
      throw new Error(`Cannot update post ${id}, ${err}`);
    }
  }

  async delete(id: string, userId: number): Promise<TPost | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT user_id FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      if (!result.rows[0] || result.rows[0].user_id !== userId) {
        conn.release();
        return null;
      }
      const sql2 = 'DELETE FROM posts WHERE id=$1 RETURNING *';
      const result2 = await conn.query(sql2, [id]);
      conn.release();
      return result2.rows[0];
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

  // ? pagination
  async paginate(
    author: number | null,
    limit: number,
    skip: number
  ): Promise<{ posts: TPost[]; postsCount: number }> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id from posts';
      const result = await conn.query(sql);
      const sql2 = `SELECT * FROM posts ${
        author ? 'WHERE user_id=' + author : ''
      } LIMIT $1 OFFSET $2`;
      const result2 = await conn.query(sql2, [limit, skip]);
      conn.release();
      return { posts: result2.rows, postsCount: result.rowCount };
    } catch (err) {
      throw new Error(`Cannot get posts ${err}`);
    }
  }
}
