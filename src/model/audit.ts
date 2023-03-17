import APIError from '../Error/ApiError';
import Client from '../database/client';
import ErrorType from '../Error/error.type';

export interface IAudit {
  auditAction: string;
  data: string;
  status: number;
  error: string;
  auditBy: string;
  auditOn: Date;
}

class Audit {
  async create(audit: IAudit): Promise<IAudit> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO audit (audit_action, audit_data, audit_status, audit_error, audit_by, audit_on) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
      const result = await conn.query(sql, [
        audit.auditAction,
        audit.data,
        audit.status,
        audit.error,
        audit.auditBy,
        audit.auditOn,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new APIError(
        ErrorType.API_ERROR + 'failed to create audit',
        500,
        `valid to audit :${audit.data}`,
        true
      );
    }
  }
}
export default Audit;
