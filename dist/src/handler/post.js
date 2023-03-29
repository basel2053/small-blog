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
const promises_1 = require("fs/promises");
const post_1 = require("../model/post");
const upload_1 = __importDefault(require("../util/upload"));
const optimizeImage_1 = __importDefault(require("../middleware/optimizeImage"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const validation_1 = __importDefault(require("../middleware/validation"));
const ApiError_1 = __importDefault(require("../Error/ApiError"));
const postValidators_1 = require("../util/validators/postValidators");
const store = new post_1.Post();
const postsPerPage = 6;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = Number(req.query.author) || null;
        const posts = yield store.index(author);
        res.json({ message: 'retrived posts sucessfully', data: posts });
    }
    catch (err) {
        throw new Error(`couldn't get posts, ${err}`);
    }
});
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const author = req.query.author;
        const query = req.query.query || '';
        const skip = (page - 1) * postsPerPage;
        const postsInfo = yield store.filter(author, query, postsPerPage, skip);
        const postsCount = postsInfo.postsCount;
        const numberOfPages = Math.ceil(postsCount / postsPerPage);
        const next = page * postsPerPage < postsCount ? true : false;
        const prev = page > 1 ? true : false;
        res.status(200).json({
            message: 'retrived posts sucessfully',
            posts: postsInfo.posts,
            pagination: { postsCount, numberOfPages, page, next, prev },
        });
    }
    catch (err) {
        throw new Error(`couldn't get posts, ${err}`);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield store.show(req.params.postId);
        if (!post.post) {
            return next(new ApiError_1.default(`couldn't find post ${req.params.postId}`, 404, 'failed to find the post', true));
        }
        res.status(200).json({
            message: 'retrived post sucessfully',
            post: post.post,
            comments: post.comments,
        });
    }
    catch (err) {
        res.sendStatus(404);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = res.locals.username;
        const post = yield store.create(Object.assign(Object.assign({}, req.body), { author }));
        res.status(201).json({ message: 'post created sucessfully', data: post });
    }
    catch (err) {
        throw new Error(`couldn't create post , ${err}`);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield store.update(req.params.postId, req.body, res.locals.username);
        if (!(post === null || post === void 0 ? void 0 : post.post)) {
            return next(new ApiError_1.default(`couldn't find post ${req.params.postId} to update`, 404, 'failed to find the post', true));
        }
        if (req.body.image) {
            try {
                yield (0, promises_1.unlink)(post.image);
            }
            catch (err) {
                return res
                    .status(500)
                    .json({ warning: "Image wasn't deleted, path error", data: post });
            }
        }
        res.json({ message: 'post updated sucessfully', data: post.post });
    }
    catch (err) {
        throw new Error(`couldn't updated post , ${err}`);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield store.delete(req.params.postId, res.locals.username);
        if (!post) {
            return next(new ApiError_1.default(`couldn't find post ${req.params.postId} to delete`, 404, 'failed to find the post', true));
        }
        yield (0, promises_1.unlink)(post.image);
        res.json({ message: 'posts deleted sucessfully', data: post });
    }
    catch (err) {
        throw new Error(`couldn't delete post , ${err}`);
    }
});
const postRoutes = (app) => {
    app
        .route('/posts')
        .get(verifyToken_1.default, index)
        .post(verifyToken_1.default, upload_1.default.single('image'), (0, postValidators_1.validatePostCreate)(), validation_1.default, optimizeImage_1.default, create);
    app
        .route('/posts/:postId')
        .get(verifyToken_1.default, show)
        .delete(verifyToken_1.default, (0, postValidators_1.validatePostDelete)(), validation_1.default, remove)
        .patch(verifyToken_1.default, upload_1.default.single('image'), (0, postValidators_1.validatePostUpdate)(), validation_1.default, optimizeImage_1.default, update);
    app.get('/filter', verifyToken_1.default, filter);
};
exports.default = postRoutes;
