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
const ApiError_1 = __importDefault(require("../Error/ApiError"));
const client_1 = __importDefault(require("../database/client"));
const error_type_1 = __importDefault(require("../Error/error.type"));
class Audit {
    create(audit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield client_1.default.connect();
                const sql = `INSERT INTO audit (audit_action, audit_data, audit_status, audit_error, audit_by, audit_on) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
                const result = yield conn.query(sql, [
                    audit.auditAction,
                    audit.data,
                    audit.status,
                    audit.error,
                    audit.auditBy,
                    audit.auditOn,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new ApiError_1.default(error_type_1.default.API_ERROR + 'failed to create audit', 500, `valid to audit :${audit.data}`, true);
            }
        });
    }
}
exports.default = Audit;
