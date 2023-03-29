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
exports.prepareAudit = void 0;
const events_1 = require("events");
const audit_1 = __importDefault(require("../model/audit"));
const ApiError_1 = __importDefault(require("../Error/ApiError"));
const error_type_1 = __importDefault(require("../Error/error.type"));
const emitter = new events_1.EventEmitter();
const auditEvent = 'audit';
const store = new audit_1.default();
emitter.on(auditEvent, (audit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        store.create(audit);
    }
    catch (err) {
        throw new ApiError_1.default(error_type_1.default.API_ERROR + 'failed to audit', 500, `valid to audit :${audit.data}`, true);
    }
}));
const prepareAudit = (auditAction, data, error, auditBy, auditOn) => {
    let status = 200;
    if (error)
        status = 500;
    const auditObj = { auditAction, data, status, error, auditBy, auditOn };
    emitter.emit(auditEvent, auditObj);
};
exports.prepareAudit = prepareAudit;
