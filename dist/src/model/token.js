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
exports.Token = void 0;
const client_1 = __importDefault(require("../database/client"));
class Token {
    createToken(token, code, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'INSERT INTO tokens (userid,token,code,createdat) VALUES ($1,$2,$3,$4)';
                yield conn.query(sql, [
                    userId,
                    token,
                    code,
                    Date.now() + 15 * 60 * 1000 + '',
                ]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Cannot create reset password token ${err}`);
            }
        });
    }
    getToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM tokens WHERE userid=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                if (+result.rows[0].createdat < Date.now())
                    return null;
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot get the reset password token`);
            }
        });
    }
    verifiedCode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE tokens SET verified=TRUE WHERE userid=$1';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Cannot get the reset password token`);
            }
        });
    }
    removeToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'DELETE FROM tokens WHERE userid=$1';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (err) {
                throw new Error(`An error happend while remove reset token`);
            }
        });
    }
}
exports.Token = Token;
