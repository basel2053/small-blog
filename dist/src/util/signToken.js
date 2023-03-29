"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const signToken = (user, secret, expiry) => {
    // NOTE  providing a cb at end makes it async
    const token = (0, jsonwebtoken_1.sign)({ user }, secret, {
        expiresIn: expiry,
    });
    return token;
};
exports.default = signToken;
