import Client from '../database/client';

interface IToken {
  id?: number;
  userId: number;
  token: string;
  code: string;
  verified: boolean;
  createdAt?: Date;
}

export class Token {
  async createToken(
    token: string,
    code: string,
    userId?: number
  ): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO tokens (userid,token,code,createdat) VALUES ($1,$2,$3,$4)';
      await conn.query(sql, [
        userId,
        token,
        code,
        Date.now() + 15 * 60 * 1000 + '',
      ]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot create reset password token ${err}`);
    }
  }

  async getToken(id: string): Promise<IToken | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM tokens WHERE userid=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (+result.rows[0].createdat < Date.now()) return null;
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get the reset password token`);
    }
  }

  async verifiedCode(id: string): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE tokens SET verified=TRUE WHERE userid=$1';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot get the reset password token`);
    }
  }

  async removeToken(id: string): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM tokens WHERE userid=$1';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`An error happend while remove reset token`);
    }
  }
}
