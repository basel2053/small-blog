import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

describe('GET /posts', function () {
  it('return list of posts', function (done) {
    return request(app)
      .get('/posts')
      .expect(200)
      .expect((res) => {
        console.log('list of posts: ' + JSON.stringify(res.body));
      })
      .end(done);
    expect(2);
  });
});
