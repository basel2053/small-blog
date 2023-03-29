"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentDelete = exports.validateCommentUpdate = exports.validateCommentCreate = void 0;
const express_validator_1 = require("express-validator");
const validateCommentCreate = () => {
    return [
        (0, express_validator_1.body)('body', 'Invalid comment body')
            .notEmpty()
            .isLength({ min: 1, max: 400 }),
        (0, express_validator_1.body)('postId', 'Must provide post id').notEmpty().isNumeric(),
    ];
};
exports.validateCommentCreate = validateCommentCreate;
const validateCommentUpdate = () => {
    return [
        (0, express_validator_1.param)('commentId').notEmpty().isNumeric(),
        (0, express_validator_1.body)('body', 'Invalid comment body')
            .notEmpty()
            .isLength({ min: 1, max: 400 }),
    ];
};
exports.validateCommentUpdate = validateCommentUpdate;
const validateCommentDelete = () => {
    return [(0, express_validator_1.param)('commentId').notEmpty().isNumeric()];
};
exports.validateCommentDelete = validateCommentDelete;
