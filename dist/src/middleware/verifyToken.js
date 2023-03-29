"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    var _a;
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ error: 'No token was provided' });
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        res.locals.userId = payload.user.id;
        res.locals.username = payload.user.name;
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Token invalid or expired' });
    }
};
exports.default = verifyToken;
