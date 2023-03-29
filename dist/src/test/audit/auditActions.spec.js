"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const auditAction_1 = __importDefault(require("../../audit/auditAction"));
describe('Audit actions', () => {
    it('Should have 1 action', () => {
        (0, chai_1.expect)(auditAction_1.default).to.have.key('save_user');
        (0, chai_1.expect)(auditAction_1.default.save_user).to.eq('SAVE_USER');
    });
});
