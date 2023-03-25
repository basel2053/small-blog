import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

const testImage = `${__dirname}/../../../test_assets/tests.png`;

describe('Comment handler', () => {
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

  describe('POST /comments', () => {
    before(async () => {
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

    it('Should create a comment for the post with id 2', async () => {
      const comment = { body: 'boom', postId: 2 };
      const response = await request(app)
        .post('/comments')
        .send(comment)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(201);
      expect(response.body.message).eq('Comment created');
      expect(response.body.comment.body).eq('boom');
    });

    it("Should give an error when trying to create comment for a post that doesn't exists", async () => {
      const comment = { body: 'boom', postId: 20 };
      const response = await request(app)
        .post('/comments')
        .send(comment)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(404);
      expect(response.body.error).eq(
        "The post 20 doesn't exists, to leave a comment on it"
      );
    });

    it('Should give an error when creating comment with invalid body', async () => {
      const comment = { body: '', postId: 2 };
      const response = await request(app)
        .post('/comments')
        .send(comment)
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(422);
      expect(response.body.errors.msg).eq('Invalid comment body');
    });

    it('Should forbid creating comment without jwt', async () => {
      const comment = { body: 'boom', postId: 2 };
      const response = await request(app)
        .post('/comments')
        .send(comment)
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('PATCH /comments/:commentId', () => {
    it('Should update comment width id 1 ', async () => {
      const response = await request(app)
        .patch('/comments/1')
        .send({ body: 'baam' })
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(200);
      expect(response.body.message).eq('Comment is successfully edited');
    });

    it('Should give an error when updating comment with invalid body', async () => {
      const response = await request(app)
        .patch('/comments/1')
        .send({ body: '' })
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/);
      expect(response.status).eq(422);
      expect(response.body.errors.msg).eq('Invalid comment body');
    });

    it('Should forbid creating comment without jwt', async () => {
      const response = await request(app)
        .patch('/comments/1')
        .send({ body: 'boom no jwt' })
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });
  });

  describe('DELETE /comments/:commentId', () => {
    it('Should forbid deleting comment without jwt', async () => {
      const response = await request(app)
        .delete('/comments/1')
        .expect('Content-Type', /json/);
      expect(response.status).eq(403);
      expect(response.body.error).eq('No token was provided');
    });

    it('Should delete comment width id 1 ', async () => {
      const response = await request(app)
        .delete('/comments/1')
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).eq(204);
    });
  });
});
