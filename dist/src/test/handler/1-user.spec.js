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
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../model/user");
const store = new user_1.User();
describe('User handler', () => {
    let id, token;
    describe('POST /users/signup', () => {
        it('Should create new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test@test.com',
                password: '123456',
                confirmPassword: '123456',
                name: 'Bassel',
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/signup')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(201);
            (0, chai_1.expect)(response.body.message).eq('user created');
            id = response.body.user.id;
        }));
        it('Should throw an error name must be unique', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test2@test.com',
                password: '123456',
                confirmPassword: '123456',
                name: 'Bassel',
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/signup')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(422);
            (0, chai_1.expect)(response.body.errors.msg).eq('E-mail and Username must be unique.');
        }));
        it('Should throw validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test10',
                password: '123456',
                confirmPassword: '123456',
                name: 'Bassel10',
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/signup')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(422);
            (0, chai_1.expect)(response.body.errors.msg).eq('Please provide a valid email.');
        }));
    });
    describe('POST /users/login', () => {
        // HERE  before confirming email
        it('Should reject login before email confirmation', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test@test.com',
                password: '123456',
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/login')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(401);
            (0, chai_1.expect)(response.body.error).eq('Please confirm your email.');
        }));
        // HERE  after confirming email
        it('Should login user sucessfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test@test.com',
                password: '123456',
            };
            yield store.confirmUser(id);
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/login')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.name).eq('Bassel');
            (0, chai_1.expect)(response.headers['set-cookie'][0]).to.be.a('string');
            token = response.body.accessToken;
        }));
        it('Should reject login, invalid account', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                email: 'test@test.com',
                password: '000000',
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/login')
                .send(user)
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq('Invalid email or password');
        }));
    });
    describe('POST /users/forgot-password', () => {
        it('Should confirm an E-mail is sent when giving registered email', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/forgot-password')
                .send({ email: 'test@test.com' })
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('An E-mail has been sent.');
        }));
        it('Should deny that the user exists if email not registered', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/forgot-password')
                .send({ email: 'notfound@test.com' })
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq("User doesn't exist..");
        }));
    });
    describe('POST /users/check-reset', () => {
        it('Should give an error if the reset code is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // IMPORTANT  the code is only 6 digits
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/check-reset')
                .send({ code: 111111 })
                .query({ id, token: 'dummy-token' })
                .set('Accept', 'application/json');
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq('Expired password reset token or wrong code');
        }));
    });
    describe('POST /users/reset-password', () => {
        it('Should give an error, when the reset code is not verified', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post('/users/reset-password')
                .send({ password: '123456', confirmPassword: '123456' })
                .query({ id });
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('Password reset code is not verified you are not allowed to change password.');
        }));
    });
    describe('GET /users/:author', () => {
        it('Should return user info, if jwt provided and username', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/users/Bassel')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(200);
            (0, chai_1.expect)(response.body.message).eq('retrived the user');
        }));
        it('Should prevent from getting user if there is no jwt', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/users/Bassel')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('No token was provided');
        }));
        it("Should not get user cause it doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/users/Bassel2')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(404);
            (0, chai_1.expect)(response.body.error).eq("couldn't find user Bassel2");
        }));
    });
});
