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
const date_1 = __importDefault(require("../util/date"));
const winston_1 = __importDefault(require("winston"));
class LoggerService {
    constructor(route) {
        this.route = route;
        const logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.printf((info) => {
                let message = `${(0, date_1.default)()} | ${info.level.toUpperCase()} | ${info.message} | `;
                message = info.obj
                    ? message + `data ${JSON.stringify(info.obj)} | `
                    : message;
                return message;
            }),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({
                    filename: `${process.env.LOG_FILE_PATH} /${route}.log`,
                }),
            ],
        });
        this.logger = logger;
    }
    info(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`info`, message);
        });
    }
    infoObject(message, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`info`, message, { obj });
        });
    }
}
exports.default = LoggerService;
