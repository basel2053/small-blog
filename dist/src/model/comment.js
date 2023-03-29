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
exports.Comment = void 0;
const client_1 = __importDefault(require("../database/client"));
class Comment {
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM comments WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Couldn't get comment ${id}`);
            }
        });
    }
    create(postId, author, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'INSERT INTO comments(postid,author,body,createdat) VALUES ($1,$2,$3,$4) RETURNING *';
                const result = yield conn.query(sql, [
                    postId,
                    author,
                    body,
                    Date.now() + '',
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Error while creating a comments for post ${postId}`);
            }
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'UPDATE comments SET body=$1 WHERE id=$2';
                yield conn.query(sql, [body, id]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Couldn't update commnet ${id}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'DELETE FROM comments WHERE id=$1';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (err) {
                throw new Error(`Couldn't delete commnet ${id}`);
            }
        });
    }
}
exports.Comment = Comment;
