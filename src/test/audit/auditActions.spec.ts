import { expect } from 'chai';
import auditActions from '../../audit/auditAction';

describe('Audit actions', () => {
  it('Should have 1 action', () => {
    expect(auditActions).to.have.key('save_user');
    expect(auditActions.save_user).to.eq('SAVE_USER');
  });
});
