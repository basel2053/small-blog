import Client from '../database/client';
import { TCommnet } from './comment';

export type TPost = {
  id?: number;
  title: string;
  description: string;
  html: string;
  field: string;
  image: string;
  author: string;
};

export class Post {
  async index(author: number | null): Promise<TPost[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM posts ${
        author ? 'WHERE author=' + author : ''
      }`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get posts ${err}`);
    }
  }

  async show(id: string): Promise<{ post: TPost; comments: TCommnet[] }> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      const sql2 = 'SELECT * FROM comments WHERE postid=$1';
      const result2 = await conn.query(sql2, [id]);
      conn.release();
      return { post: result.rows[0], comments: result2.rows };
    } catch (err) {
      throw new Error(`Cannot get post ${id}, ${err}`);
    }
  }

  async showWithoutComments(id: string): Promise<TPost> {
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

  async update(
    id: string,
    post: TPost,
    username: string
  ): Promise<{ post: TPost; image: string } | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT author,image FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      if (!result.rows[0] || result.rows[0].author !== username) {
        conn.release();
        return null;
      }
      const sql2 =
        'UPDATE posts SET title=$1,description=$2,html=$3, image=$4, field=$5 WHERE id=$6 RETURNING *';
      const result2 = await conn.query(sql2, [
        post.title,
        post.description,
        post.html,
        post.image ? post.image : result.rows[0].image,
        post.field,
        id,
      ]);
      conn.release();
      return { post: result2.rows[0], image: result.rows[0].image };
    } catch (err) {
      throw new Error(`Cannot update post ${id}, ${err}`);
    }
  }

  async delete(id: string, username: string): Promise<TPost | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT author FROM posts WHERE id=$1';
      const result = await conn.query(sql, [id]);
      if (!result.rows[0] || result.rows[0].author !== username) {
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
        'INSERT INTO posts(title,description,html,field,image,author,readTime) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
      const result = await conn.query(sql, [
        post.title,
        post.description,
        post.html,
        post.field,
        post.image,
        post.author,
        Math.ceil(post.description.split(' ').length / 80),
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create post `);
    }
  }

  // ? for filteration, search, and pagination
  async filter(
    author: string | undefined,
    query: string | undefined,
    limit: number,
    skip: number
  ): Promise<{ posts: TPost[]; postsCount: number }> {
    try {
      const whereQuery = `${author || query ? ' WHERE' : ''}`;
      const andQuery = `${author && query ? ' AND' : ''}`;
      const authorQuery = `${author ? ' author=' + `'${author}'` : ''}`;
      const searchQuery = `${query ? ` title ILIKE '%${query}%'` : ''}`;
      const myUltimateQuery = `SELECT * FROM posts${whereQuery}${authorQuery}${andQuery}${searchQuery}`;
      // ! NOTE if it work properly try to add these variables as $(variables) in the conn.query instead of putting all of it in the string
      const conn = await Client.connect();
      const sql = myUltimateQuery;
      const result = await conn.query(sql);
      const sql2 = `${myUltimateQuery} LIMIT $1 OFFSET $2`;
      const result2 = await conn.query(sql2, [limit, skip]);
      conn.release();
      return { posts: result2.rows, postsCount: result.rowCount };
    } catch (err) {
      throw new Error(`Cannot get posts ${err}`);
    }
  }
}
