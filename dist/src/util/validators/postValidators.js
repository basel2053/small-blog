"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostDelete = exports.validatePostUpdate = exports.validatePostCreate = void 0;
const express_validator_1 = require("express-validator");
// NOTE   we can use oneOf in update if we only want to at least get 1 field
const validatePostCreate = () => {
    return [
        (0, express_validator_1.body)('title', 'Invalid title')
            .notEmpty()
            .isString()
            .isLength({ min: 3, max: 50 }),
        (0, express_validator_1.body)('description', 'Invalid description').notEmpty().isLength({ min: 50 }),
        (0, express_validator_1.body)('field', 'Invalid field').isIn([
            'Web Programming',
            'Embedded System',
            'Cyber Security',
            'Mobile Development',
            'DevOps',
            'Cloud Architect',
            'Software Testing',
            'Data Analytics & Visualization',
            'UI/UX',
            'System Admin',
        ]),
    ];
};
exports.validatePostCreate = validatePostCreate;
const validatePostUpdate = () => {
    return [
        (0, express_validator_1.param)('postId').notEmpty().isNumeric(),
        (0, express_validator_1.body)('title', 'Invalid title')
            .notEmpty()
            .isString()
            .isLength({ min: 3, max: 50 }),
        (0, express_validator_1.body)('description', 'Invalid description').notEmpty().isLength({ min: 50 }),
    ];
};
exports.validatePostUpdate = validatePostUpdate;
const validatePostDelete = () => {
    return [(0, express_validator_1.param)('postId').notEmpty().isNumeric()];
};
exports.validatePostDelete = validatePostDelete;
