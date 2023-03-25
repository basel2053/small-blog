import { expect } from 'chai';
import app from '../../server';
import request from 'supertest';
import { User } from '../../model/user';

const store = new User();

describe('User handler', () => {
  let id: string, token: string;
  describe('POST /users/signup', () => {
    it('Should create new user', async () => {
      const user = {
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456',
        name: 'Bassel',
      };
      const response = await request(app)
        .post('/users/signup')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(201);
      expect(response.body.message).eq('user created');

      id = response.body.user.id;
    });

    it('Should throw an error name must be unique', async () => {
      const user = {
        email: 'test2@test.com',
        password: '123456',
        confirmPassword: '123456',
        name: 'Bassel',
      };
      const response = await request(app)
        .post('/users/signup')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(422);
      expect(response.body.errors.msg).eq(
        'E-mail and Username must be unique.'
      );
    });

    it('Should throw validation error', async () => {
      const user = {
        email: 'test10',
        password: '123456',
        confirmPassword: '123456',
        name: 'Bassel10',
      };
      const response = await request(app)
        .post('/users/signup')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(422);
      expect(response.body.errors.msg).eq('Please provide a valid email.');
    });
  });

  describe('POST /users/login', () => {
    // HERE  before confirming email
    it('Should reject login before email confirmation', async () => {
      const user = {
        email: 'test@test.com',
        password: '123456',
      };
      const response = await request(app)
        .post('/users/login')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(401);
      expect(response.body.error).eq('Please confirm your email.');
    });

    // HERE  after confirming email
    it('Should login user sucessfully', async () => {
      const user = {
        email: 'test@test.com',
        password: '123456',
      };
      await store.confirmUser(id);

      const response = await request(app)
        .post('/users/login')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(200);
      expect(response.body.name).eq('Bassel');
      expect(response.headers['set-cookie'][0]).to.be.a('string');
      token = response.body.accessToken;
    });

    it('Should reject login, invalid account', async () => {
      const user = {
        email: 'test@test.com',
        password: '000000',
      };
      const response = await request(app)
        .post('/users/login')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(404);
      expect(response.body.error).eq('Invalid email or password');
    });
  });

  describe('POST /users/forgot-password', () => {
    it('Should confirm an E-mail is sent when giving registered email', async () => {
      const response = await request(app)
        .post('/users/forgot-password')
        .send({ email: 'test@test.com' })
        .set('Accept', 'application/json');
      expect(response.status).eq(200);
      expect(response.body.message).eq('An E-mail has been sent.');
    });

    it('Should deny that the user exists if email not registered', async () => {
      const response = await request(app)
        .post('/users/forgot-password')
        .send({ email: 'notfound@test.com' })
        .set('Accept', 'application/json');
      expect(response.status).eq(404);
      expect(response.body.error).eq("User doesn't exist..");
    });
  });

  describe('POST /users/check-reset', () => {
    it('Should give an error if the reset code is not valid', async () => {
      // IMPORTANT  the code is only 6 digits
      const response = await request(app)
        .post('/users/check-reset')
        .send({ code: 1234567 })
        .query({ id })
        .set('Accept', 'application/json');
      expect(response.status).eq(404);
      expect(response.body.error).eq(
        'Expired password reset token or wrong code'
      );
    });
  });

  describe('POST /users/reset-password', () => {
    it('Should give an error, when the reset code is not verified', async () => {
      const response = await request(app)
        .post('/users/reset-password')
        .send({ password: '123456', confirmPassword: '123456' })
        .query({ id });
      expect(response.status).eq(403);
      expect(response.body.error).eq(
        'Password reset code is not verified you are not allowed to change password.'
      );
    });
  });

  describe('GET /users/:author', () => {
    it('Should return user info, if jwt provided and username', async () => {
      const response = await request(app)
        .get('/users/Bassel')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.message).eq('retrived the user');
    });

    it('Should prevent from getting user if there is no jwt', async () => {
      const response = await request(app)
        .get('/users/Bassel')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });

    it("Should not get user cause it doesn't exists", async () => {
      const response = await request(app)
        .get('/users/Bassel2')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(404);
      expect(response.body.error).eq("couldn't find user Bassel2");
    });
  });
});

/*
const response = await request(app)
        .post('/users/login')
        .send(user)
        .set('Accept', 'application/json');
      expect(response.status).eq(404);
      expect(response.body.error).eq('Invalid email or password');
       */
