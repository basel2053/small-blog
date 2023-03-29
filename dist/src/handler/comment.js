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
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const comment_1 = require("../model/comment");
const post_1 = require("../model/post");
const ApiError_1 = __importDefault(require("../Error/ApiError"));
const commentValidators_1 = require("../util/validators/commentValidators");
const validation_1 = __importDefault(require("../middleware/validation"));
const store = new comment_1.Comment();
const postStore = new post_1.Post();
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, postId } = req.body;
        const post = yield postStore.showWithoutComments(postId);
        if (!post) {
            return next(new ApiError_1.default(`The post ${postId} doesn't exists, to leave a comment on it`, 404, 'the user is trying to add a comment for a post which cannot be found.', true));
        }
        const author = res.locals.username;
        const comment = yield store.create(postId, author, body);
        res.status(201).send({ message: 'Comment created', comment });
    }
    catch (err) {
        res.sendStatus(400);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { body } = req.body;
        const comment = yield store.show(+commentId);
        if (res.locals.username !== comment.author) {
            return next(new ApiError_1.default(`You are not allowed to edit this comment`, 403, 'Only the comment creator can edit the comment.', true));
        }
        yield store.update(+commentId, body);
        res.status(200).send({ message: 'Comment is successfully edited' });
    }
    catch (err) {
        res.sendStatus(400);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const comment = yield store.show(+commentId);
        const post = yield postStore.showWithoutComments(comment.postid + '');
        const user = res.locals.username;
        if (user !== comment.author && user !== post.author) {
            return next(new ApiError_1.default(`You are not allowed to delete this comment`, 403, 'Only the comment creator or post author can delete the comment.', true));
        }
        yield store.delete(+commentId);
        res.sendStatus(204);
    }
    catch (err) {
        res.sendStatus(400);
    }
});
const commentsRoutes = (app) => {
    // NOTE  Ideally it would be better to make routes --> /posts/:postId/comments
    app.post('/comments', verifyToken_1.default, (0, commentValidators_1.validateCommentCreate)(), validation_1.default, create);
    app
        .route('/comments/:commentId')
        .patch(verifyToken_1.default, (0, commentValidators_1.validateCommentUpdate)(), validation_1.default, update)
        .delete(verifyToken_1.default, (0, commentValidators_1.validateCommentDelete)(), validation_1.default, remove);
};
exports.default = commentsRoutes;
