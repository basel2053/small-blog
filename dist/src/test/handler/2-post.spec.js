"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const testImage = `${__dirname}/../../../test_assets/test-image.png`;
const testImage2 = `${__dirname}/../../../test_assets/tests.png`;
describe('Post handler', () => {
    let token;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: 'test@test.com',
            password: '123456',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/users/login')
            .send(user)
            .set('Accept', 'application/json');
        token = response.body.accessToken;
    }));
    describe('GET /posts', () => {
        it('should return list of posts, require jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/posts')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('retrived posts sucessfully');
        }));
        it('should forbid access to posts if no jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/posts')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('POST /posts', () => {
        it('Should create post, with valid fields and jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/posts')
                .set({
                'Content-Type': 'application/json',
            })
                .field('title', 'Hello World')
                .field('description', 'Hello World Again Hello World Again Hello World Again')
                .field('field', 'Data Analytics & Visualization')
                .attach('image', testImage)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(201);
            (0, chai_1.expect)(response.body.message).eq('post created sucessfully');
        }));
        it('Should fail to create, when body is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
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
            (0, chai_1.expect)(response.status).eq(422);
            (0, chai_1.expect)(response.body.errors.msg).eq('Invalid description');
        }));
        it('Should fail to create, if not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/posts')
                .set({
                'Content-Type': 'application/json',
            })
                .field('title', 'Hello World')
                .field('description', 'Hello World Again Hello World Again Hello World Again')
                .field('field', 'Data Analytics & Visualization')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('GET /posts/:postId', () => {
        it('Should fetch post with id 1', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/posts/1')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.post.title).eq('Hello World');
        }));
        it('Should give 404, if there is no post found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/posts/50')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq("couldn't find post 50");
        }));
        it('Should forbid access to posts if no jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/posts/1')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('PATCH /posts/:postId', () => {
        it('Should update post with id 1 (without image)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/posts/1')
                .set({
                'Content-Type': 'application/json',
            })
                .field('title', 'Hello World5')
                .field('description', 'Hello World Again Hello World Again Hello World Again5')
                .field('field', 'Data Analytics & Visualization')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('post updated sucessfully');
            (0, chai_1.expect)(response.body.data.title).eq('Hello World5');
            (0, chai_1.expect)(response.body.data.description).eq('Hello World Again Hello World Again Hello World Again5');
        }));
        it('Should update post with id 1', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/posts/1')
                .set({
                'Content-Type': 'application/json',
            })
                .field('title', 'Boom Boom')
                .field('description', 'Hello World Again Hello World Again Hello Of Boom Boom')
                .field('field', 'Data Analytics & Visualization')
                .attach('image', testImage2)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.data.title).eq('Boom Boom');
            (0, chai_1.expect)(response.body.data.description).eq('Hello World Again Hello World Again Hello Of Boom Boom');
        }));
        it('Should not update post with id 1, when there is no jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/posts/1')
                .set({
                'Content-Type': 'application/json',
            })
                .field('title', 'Hello World5')
                .field('description', 'Hello World Again Hello World Again Hello World Again5')
                .field('field', 'Data Analytics & Visualization')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('DELETE /posts/:postId', () => {
        it('Should forbid deleting post with id 1 without jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .delete('/posts/1')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
        it('Should delete post with id 1', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .delete('/posts/1')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('posts deleted sucessfully');
        }));
    });
});
