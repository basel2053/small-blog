"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const date_1 = __importDefault(require("../../util/date"));
describe('current date function', () => {
    it('Should return the current date after its called', () => {
        (0, chai_1.expect)((0, date_1.default)()).to.be.a('string');
        (0, chai_1.expect)((0, date_1.default)()).eq(new Date().toLocaleString());
    });
});
