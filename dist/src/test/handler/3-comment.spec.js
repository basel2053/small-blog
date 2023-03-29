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
const testImage = `${__dirname}/../../../test_assets/tests.png`;
describe('Comment handler', () => {
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
    describe('POST /comments', () => {
        before(() => __awaiter(void 0, void 0, void 0, function* () {
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
        it('Should create a comment for the post with id 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const comment = { body: 'boom', postId: 2 };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/comments')
                .send(comment)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(201);
            (0, chai_1.expect)(response.body.message).eq('Comment created');
            (0, chai_1.expect)(response.body.comment.body).eq('boom');
        }));
        it("Should give an error when trying to create comment for a post that doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const comment = { body: 'boom', postId: 20 };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/comments')
                .send(comment)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq("The post 20 doesn't exists, to leave a comment on it");
        }));
        it('Should give an error when creating comment with invalid body', () => __awaiter(void 0, void 0, void 0, function* () {
            const comment = { body: '', postId: 2 };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/comments')
                .send(comment)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(422);
            (0, chai_1.expect)(response.body.errors.msg).eq('Invalid comment body');
        }));
        it('Should forbid creating comment without jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const comment = { body: 'boom', postId: 2 };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/comments')
                .send(comment)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('PATCH /comments/:commentId', () => {
        it('Should update comment width id 1 ', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/comments/1')
                .send({ body: 'baam' })
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('Comment is successfully edited');
        }));
        it('Should give an error when updating comment with invalid body', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/comments/1')
                .send({ body: '' })
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(422);
            (0, chai_1.expect)(response.body.errors.msg).eq('Invalid comment body');
        }));
        it('Should forbid creating comment without jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch('/comments/1')
                .send({ body: 'boom no jwt' })
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
    });
    describe('DELETE /comments/:commentId', () => {
        it('Should forbid deleting comment without jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .delete('/comments/1')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
        it('Should delete comment width id 1 ', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .delete('/comments/1')
                .set('Authorization', 'Bearer ' + token);
            (0, chai_1.expect)(response.status).eq(204);
        }));
    });
});
