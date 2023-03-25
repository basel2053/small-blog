import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

describe('RefreshToken handler', () => {
  describe('GET /token/refresh', () => {
    it('Should give an error if no refreshToken in cookie', async () => {
      const response = await request(app)
        .get('/token/refresh')
        .expect('Content-Type', /json/);
      expect(response.status).eq(401);
      expect(response.body.error).eq(
        'You are not authorized to get such info, please login first'
      );
    });
  });

  describe('GET /logout', () => {
    it('Should give an error no refreshToken in cookie to remove', async () => {
      const response = await request(app)
        .get('/logout')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq(
        'You are not allowed do such an action, no token available.'
      );
    });
  });
});
