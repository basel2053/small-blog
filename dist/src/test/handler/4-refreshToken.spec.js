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
describe('RefreshToken handler', () => {
    describe('GET /token/refresh', () => {
        it('Should give an error if no refreshToken in cookie', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/token/refresh')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(401);
            (0, chai_1.expect)(response.body.error).eq('You are not authorized to get such info, please login first');
        }));
    });
    describe('GET /logout', () => {
        it('Should give an error no refreshToken in cookie to remove', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get('/logout')
                .expect('Content-Type', /json/);
            (0, chai_1.expect)(response.status).eq(403);
            (0, chai_1.expect)(response.body.error).eq('You are not allowed do such an action, no token available.');
        }));
    });
});
