import { User } from './../../model/user';
import { expect } from 'chai';

const store = new User();

describe('User model', () => {
  it('Should return all users in DB', async () => {
    const users = await store.index();
    expect(users).to.have.lengthOf(1);
    expect(users).to.eql([{ email: 'test@test.com', name: 'Bassel' }]);
  });

  it('Should return a user by name', async () => {
    const user = await store.show('Bassel');
    expect(user).have.keys('author', 'posts');
  });

  it('Should return a user by it id', async () => {
    const user = await store.getById('1');
    expect(user).have.keys(
      'email',
      'name',
      'refreshtoken',
      'confirmed',
      'id',
      'password'
    );
    expect(user.name).to.eq('Bassel');
  });
});
