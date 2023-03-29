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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserResetPassword = exports.validateUserCheckReset = exports.validateUserForgetPassword = exports.validateUserAuthenticate = exports.validateUserUpdate = exports.validateUserCreate = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../../model/user");
const store = new user_1.User();
// email or name
const validateUserCreate = () => {
    return [
        (0, express_validator_1.body)('email', 'Please provide a valid email.')
            .notEmpty()
            .isEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield store.validate(value, req.body.name);
            if (user) {
                return Promise.reject('E-mail and Username must be unique.');
            }
            // NOTE  to check whether the email is invalid or name ---> we can check if (value === user.email) or (req.body.name === user.name)
        })),
        (0, express_validator_1.body)('password', 'Invalid password should be 6-16 characters')
            .isAlphanumeric()
            .isLength({ min: 6, max: 16 })
            .notEmpty()
            .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        (0, express_validator_1.body)('name', 'Invalid username should be at least 2 characters')
            .isString()
            .isLength({ min: 2, max: 40 }),
    ];
};
exports.validateUserCreate = validateUserCreate;
const validateUserUpdate = () => {
    return [
        // body('password', 'Invalid password should be 6-16 characters')
        //   .isAlphanumeric()
        //   .isLength({ min: 6, max: 16 })
        //   .notEmpty()
        //   .custom((value: string, { req }) => {
        //     if (value !== req.body.confirmPassword) {
        //       throw new Error('Password confirmation does not match password');
        //     }
        //     return true;
        //   }),
        (0, express_validator_1.body)('bio', 'Invalid Bio')
            .isString()
            .isLength({ min: 1, max: 100 })
            .notEmpty(),
        (0, express_validator_1.param)('id').notEmpty().isNumeric(),
    ];
};
exports.validateUserUpdate = validateUserUpdate;
const validateUserAuthenticate = () => {
    return [
        (0, express_validator_1.body)('email', 'Please provide a valid email.').notEmpty().isEmail(),
        (0, express_validator_1.body)('password', 'Invalid password should be 6-16 characters')
            .isAlphanumeric()
            .isLength({ min: 6, max: 16 })
            .notEmpty(),
    ];
};
exports.validateUserAuthenticate = validateUserAuthenticate;
const validateUserForgetPassword = () => {
    return [(0, express_validator_1.body)('email', 'Please provide a valid email.').notEmpty().isEmail()];
};
exports.validateUserForgetPassword = validateUserForgetPassword;
const validateUserCheckReset = () => {
    return [
        (0, express_validator_1.body)('code', 'Please provide a valid email.')
            .notEmpty()
            .isAlphanumeric()
            .isLength({ min: 6, max: 6 }),
        (0, express_validator_1.query)('token').notEmpty().isString(),
        (0, express_validator_1.query)('id').notEmpty().isString(),
    ];
};
exports.validateUserCheckReset = validateUserCheckReset;
const validateUserResetPassword = () => {
    return [
        (0, express_validator_1.body)('password', 'Invalid password should be 6-16 characters')
            .isAlphanumeric()
            .isLength({ min: 6, max: 16 })
            .notEmpty()
            .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        (0, express_validator_1.query)('id').notEmpty().isString(),
    ];
};
exports.validateUserResetPassword = validateUserResetPassword;
