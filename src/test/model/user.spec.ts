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
    expect(user).to.have.keys('author', 'posts');
  });

  it('Should return a user by it id', async () => {
    const user = await store.getById('1');
    expect(user).to.have.keys(
      'email',
      'name',
      'refreshtoken',
      'confirmed',
      'id',
      'password'
    );
    expect(user.name).to.eq('Bassel');
  });

  it('Should create new user in database with correct user info', async () => {
    const user = {
      email: 'bassel@example.com',
      password: '000000',
      name: 'example',
    };
    const createdUser = await store.create(user);
    expect(createdUser).to.eql({
      email: 'bassel@example.com',
      name: 'example',
      id: 2,
    });
  });

  it('Should delete user with id 2', async () => {
    const user = await store.delete('2');
    expect(user.id).to.eq(2);
  });
});
