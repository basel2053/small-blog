import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

const testImage = `${__dirname}/../../../test_assets/test-image.png`;
const testImage2 = `${__dirname}/../../../test_assets/tests.png`;

describe('Post handler', () => {
  let token: string;
  before(async () => {
    const user = {
      email: 'test@test.com',
      password: '123456',
    };
    const response = await request(app)
      .post('/users/login')
      .send(user)
      .set('Accept', 'application/json');
    token = response.body.accessToken;
  });

  describe('GET /posts', () => {
    it('should return list of posts, require jwt', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.message).eq('retrived posts sucessfully');
    });

    it('should forbid access to posts if no jwt', async () => {
      const response = await request(app)
        .get('/posts')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('POST /posts', () => {
    it('Should create post, with valid fields and jwt', async () => {
      const response = await request(app)
        .post('/posts')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Hello World')
        .field(
          'description',
          'Hello World Again Hello World Again Hello World Again'
        )
        .field('field', 'Data Analytics & Visualization')
        .attach('image', testImage)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(201);
      expect(response.body.message).eq('post created sucessfully');
    });

    it('Should fail to create, when body is not valid', async () => {
      const response = await request(app)
        .post('/posts')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Hello World')
        .field('description', 'Hello World Again Hello')
        .field('field', 'Data Analytics & Visualization')
        .attach('image', testImage)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(422);
      expect(response.body.errors.msg).eq('Invalid description');
    });

    it('Should fail to create, if not authorized', async () => {
      const response = await request(app)
        .post('/posts')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Hello World')
        .field(
          'description',
          'Hello World Again Hello World Again Hello World Again'
        )
        .field('field', 'Data Analytics & Visualization')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('GET /posts/:postId', () => {
    it('Should fetch post with id 1', async () => {
      const response = await request(app)
        .get('/posts/1')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.post.title).eq('Hello World');
    });

    it('Should give 404, if there is no post found', async () => {
      const response = await request(app)
        .get('/posts/50')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(404);
      expect(response.body.error).eq("couldn't find post 50");
    });

    it('Should forbid access to posts if no jwt', async () => {
      const response = await request(app)
        .get('/posts/1')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('PATCH /posts/:postId', () => {
    it('Should update post with id 1 (without image)', async () => {
      const response = await request(app)
        .patch('/posts/1')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Hello World5')
        .field(
          'description',
          'Hello World Again Hello World Again Hello World Again5'
        )
        .field('field', 'Data Analytics & Visualization')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.message).eq('post updated sucessfully');
      expect(response.body.data.title).eq('Hello World5');
      expect(response.body.data.description).eq(
        'Hello World Again Hello World Again Hello World Again5'
      );
    });

    it('Should update post with id 1', async () => {
      const response = await request(app)
        .patch('/posts/1')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Boom Boom')
        .field(
          'description',
          'Hello World Again Hello World Again Hello Of Boom Boom'
        )
        .field('field', 'Data Analytics & Visualization')
        .attach('image', testImage2)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.data.title).eq('Boom Boom');
      expect(response.body.data.description).eq(
        'Hello World Again Hello World Again Hello Of Boom Boom'
      );
    });

    it('Should not update post with id 1, when there is no jwt', async () => {
      const response = await request(app)
        .patch('/posts/1')
        .set({
          'Content-Type': 'application/json',
        })
        .field('title', 'Hello World5')
        .field(
          'description',
          'Hello World Again Hello World Again Hello World Again5'
        )
        .field('field', 'Data Analytics & Visualization')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('Should forbid deleting post with id 1 without jwt', async () => {
      const response = await request(app)
        .delete('/posts/1')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });

    it('Should delete post with id 1', async () => {
      const response = await request(app)
        .delete('/posts/1')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.message).eq('posts deleted sucessfully');
    });
  });
});
