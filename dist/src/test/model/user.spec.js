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
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./../../model/user");
const chai_1 = require("chai");
const store = new user_1.User();
describe('User model', () => {
    it('Should return all users in DB', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield store.index();
        (0, chai_1.expect)(users).to.have.lengthOf(1);
        (0, chai_1.expect)(users).to.eql([{ email: 'test@test.com', name: 'Bassel' }]);
    }));
    it('Should return a user by name', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield store.show('Bassel');
        (0, chai_1.expect)(user).to.have.keys('author', 'posts');
    }));
    it('Should return a user by it id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield store.getById('1');
        (0, chai_1.expect)(user).to.have.keys('email', 'name', 'refreshtoken', 'confirmed', 'id', 'password');
        (0, chai_1.expect)(user.name).to.eq('Bassel');
    }));
    it('Should create new user in database with correct user info', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: 'bassel@example.com',
            password: '000000',
            name: 'example',
        };
        const createdUser = yield store.create(user);
        (0, chai_1.expect)(createdUser).to.eql({
            email: 'bassel@example.com',
            name: 'example',
            id: 2,
        });
    }));
    it('Should delete user with id 2', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield store.delete('2');
        (0, chai_1.expect)(user.id).to.eq(2);
    }));
});
