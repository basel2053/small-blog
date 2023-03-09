import { EventEmitter } from 'events';
import Audit, { IAudit } from 'model/audit';
import APIError from 'Error/ApiError';
import ErrorType from 'Error/error.type';

const emitter = new EventEmitter();

const auditEvent = 'audit';

const store = new Audit();

emitter.on(auditEvent, async (audit: IAudit) => {
  try {
    store.create(audit);
  } catch (err) {
    throw new APIError(
      ErrorType.API_ERROR + 'failed to audit',
      500,
      `valid to audit :${audit.data}`,
      true
    );
  }
});

export const prepareAudit = (
  auditAction: string,
  data: string,
  error: string,
  auditBy: string,
  auditOn: Date
) => {
  let status = 200;
  if (error) status = 500;
  const auditObj = { auditAction, data, status, error, auditBy, auditOn };
  emitter.emit(auditEvent, auditObj);
};
