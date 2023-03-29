"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateFormat = () => {
    return new Date(Date.now()).toLocaleString();
};
exports.default = dateFormat;
