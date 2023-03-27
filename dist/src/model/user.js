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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const client_1 = __importDefault(require("../database/client"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const { PEPPER, SR } = process.env;
class User {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT email,name FROM users';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get users ${err}`);
            }
        });
    }
    show(author) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT name,email,bio FROM users WHERE name=$1';
                const result = yield conn.query(sql, [author]);
                const sql2 = 'SELECT * FROM posts p WHERE author=$1 ORDER BY p.id DESC LIMIT 6';
                const result2 = yield conn.query(sql2, [author]);
                conn.release();
                return { author: result.rows[0], posts: result2.rows };
            }
            catch (err) {
                throw new Error(`Cannot get user ${author}, ${err}`);
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM users WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot get user ${id}, ${err}`);
            }
        });
    }
    update(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE users SET password=$1,refreshtoken=$2 WHERE id=$3 RETURNING *';
                const hashedPassword = yield bcrypt_1.default.hash(password + PEPPER, Number(SR));
                const result = yield conn.query(sql, [hashedPassword, [], id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                console.log(`Cannot get user ${id}, ${err}`);
            }
        });
    }
    updateProfile(id, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE users SET bio=$1 WHERE id=$2';
                yield conn.query(sql, [bio, id]);
                conn.release();
            }
            catch (err) {
                console.log(`Cannot get user ${id}, ${err}`);
            }
        });
    }
    confirmUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE users SET confirmed=TRUE WHERE id=$1';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (err) {
                console.log(`Couldn't confirm user ${id}, ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'DELETE FROM users WHERE id=$1 RETURNING *';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot delete user ${id}, ${err}`);
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'INSERT INTO users(email,password,name) VALUES ($1,$2,$3) RETURNING email,name,id';
                const hashedPassword = yield bcrypt_1.default.hash(user.password + PEPPER, Number(SR));
                const result = yield conn.query(sql, [
                    user.email,
                    hashedPassword,
                    user.name,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot create user ${user.name} , ${err}`);
            }
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM users WHERE email=$1';
                const result = yield conn.query(sql, [email]);
                conn.release();
                if (result.rows.length) {
                    const user = result.rows[0];
                    if (yield bcrypt_1.default.compare(password + PEPPER, user.password)) {
                        const { password: pwd } = user, info = __rest(user, ["password"]);
                        return info;
                    }
                }
                return null;
            }
            catch (err) {
                throw new Error(`Cannot Find user ${email}, ${err}`);
            }
        });
    }
    // ? for validation purpose
    validate(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = `SELECT id,name,email,refreshtoken FROM users WHERE email=$1 ${name ? `OR name='${name + ''}'` : ''}`;
                const result = yield conn.query(sql, [email]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot Find user ${email}, ${err}`);
            }
        });
    }
    // ? for checking if user got fresh token or not
    showByToken(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = `SELECT * FROM users WHERE $1=ANY(refreshToken)`;
                const result = yield conn.query(sql, [value]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot Find user ${value}, ${err}`);
            }
        });
    }
    // ? for removing the refresh token on logout
    deleteRefreshToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = `UPDATE users SET refreshToken=NULL WHERE id=$1`;
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Cannot Find user ${id}, ${err}`);
            }
        });
    }
    storeToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE users SET refreshToken=$1 WHERE email=$2';
                yield conn.query(sql, [token, email]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Couldn't insert user ${email} refresh token, ${err}`);
            }
        });
    }
    googleAuthRegister(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'INSERT INTO users(email,name,confirmed) VALUES ($1,$2,TRUE) RETURNING email,name,id';
                const result = yield conn.query(sql, [email, name]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot create user ${name} , ${err}`);
            }
        });
    }
}
exports.User = User;
