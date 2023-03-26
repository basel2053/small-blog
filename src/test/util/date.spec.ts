import { expect } from 'chai';
import dateFormat from '../../util/date';

describe('current date function', () => {
  it('Should return the current date after its called', () => {
    expect(dateFormat()).to.be.a('string');
    expect(dateFormat()).eq(new Date().toLocaleString());
  });
});
