"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(name, statusCode, description, isOperational) {
        super(description);
        // Object.prototype(this, new.target.prototype);
        this.statusCode = statusCode;
        this.name = name;
        this.description = description;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
exports.default = BaseError;
