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
exports.Post = void 0;
const client_1 = __importDefault(require("../database/client"));
class Post {
    index(author) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = `SELECT * FROM posts ${author ? 'WHERE author=' + author : ''}`;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get posts ${err}`);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM posts WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                const sql2 = 'SELECT * FROM comments WHERE postid=$1';
                const result2 = yield conn.query(sql2, [id]);
                conn.release();
                return { post: result.rows[0], comments: result2.rows };
            }
            catch (err) {
                throw new Error(`Cannot get post ${id}, ${err}`);
            }
        });
    }
    showWithoutComments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT * FROM posts WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot get post ${id}, ${err}`);
            }
        });
    }
    update(id, post, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT author,image FROM posts WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                if (!result.rows[0] || result.rows[0].author !== username) {
                    conn.release();
                    return null;
                }
                const sql2 = 'UPDATE posts SET title=$1,description=$2,html=$3, image=$4, field=$5 WHERE id=$6 RETURNING *';
                const result2 = yield conn.query(sql2, [
                    post.title,
                    post.description,
                    post.html,
                    post.image ? post.image : result.rows[0].image,
                    post.field,
                    id,
                ]);
                conn.release();
                return { post: result2.rows[0], image: result.rows[0].image };
            }
            catch (err) {
                throw new Error(`Cannot update post ${id}, ${err}`);
            }
        });
    }
    delete(id, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'SELECT author FROM posts WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                if (!result.rows[0] || result.rows[0].author !== username) {
                    conn.release();
                    return null;
                }
                const sql2 = 'DELETE FROM posts WHERE id=$1 RETURNING *';
                const result2 = yield conn.query(sql2, [id]);
                conn.release();
                return result2.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot delete post ${id}, ${err}`);
            }
        });
    }
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = 'INSERT INTO posts(title,description,html,field,image,author,readTime) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
                const result = yield conn.query(sql, [
                    post.title,
                    post.description,
                    post.html,
                    post.field,
                    post.image,
                    post.author,
                    Math.ceil(post.description.split(' ').length / 80),
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot create post `);
            }
        });
    }
    // ? for filteration, search, and pagination
    filter(author, query, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereQuery = `${author || query ? ' WHERE' : ''}`;
                const andQuery = `${author && query ? ' AND' : ''}`;
                const authorQuery = `${author ? ' author=' + `'${author}'` : ''}`;
                const searchQuery = `${query ? ` title ILIKE '%${query}%'` : ''}`;
                const myUltimateQuery = `SELECT * FROM posts${whereQuery}${authorQuery}${andQuery}${searchQuery}`;
                // ! NOTE if it work properly try to add these variables as $(variables) in the conn.query instead of putting all of it in the string
                const conn = yield client_1.default.connect();
                const sql = myUltimateQuery;
                const result = yield conn.query(sql);
                const sql2 = `${myUltimateQuery} LIMIT $1 OFFSET $2`;
                const result2 = yield conn.query(sql2, [limit, skip]);
                conn.release();
                return { posts: result2.rows, postsCount: result.rowCount };
            }
            catch (err) {
                throw new Error(`Cannot get posts ${err}`);
            }
        });
    }
}
exports.Post = Post;
