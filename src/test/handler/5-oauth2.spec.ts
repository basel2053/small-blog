import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

describe('Oauth2 handler => GET /users/oauth2/google', () => {
  it('Should throw an error if no code is passed in body', async () => {
    const response = await request(app)
      .post('/users/oauth2/google')
      .expect('Content-Type', /text/);
    expect(response.status).eq(500);
  });
});
