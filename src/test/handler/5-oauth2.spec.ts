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

// HERE  m-down:test

/*  
     const response = await request(app)
        .get('/posts')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
      */

//  {
//     contentType: 'application/octet-stream',
//   }
