import Client from '../database/client';

export type TCommnet = {
  id?: number;
  author: string;
  postid: number;
  body: string;
  createdat: string;
};

export class Comment {
  async show(id: number): Promise<TCommnet> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM comments WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Couldn't get comment ${id}`);
    }
  }

  async create(
    postId: number,
    author: string,
    body: string
  ): Promise<TCommnet> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO comments(postid,author,body,createdat) VALUES ($1,$2,$3,$4) RETURNING *';
      const result = await conn.query(sql, [
        postId,
        author,
        body,
        Date.now() + '',
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error while creating a comments for post ${postId}`);
    }
  }

  async update(id: number, body: string): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE comments SET body=$1 WHERE id=$2';
      await conn.query(sql, [body, id]);
      conn.release();
    } catch (err) {
      throw new Error(`Couldn't update commnet ${id}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM comments WHERE id=$1';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Couldn't delete commnet ${id}`);
    }
  }
}
