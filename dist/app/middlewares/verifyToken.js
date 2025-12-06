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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const student_constant_1 = require("../modules/student/student.constant");
const student_model_1 = require("../modules/student/student.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const verifyToken = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const token = (_d = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split) === null || _c === void 0 ? void 0 : _c.call(_b, ' ')) === null || _d === void 0 ? void 0 : _d[1];
    if (!token) {
        return next(new AppError_1.default(401, 'No token provided'));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        return next(new AppError_1.default(401, 'Invalid or expired token'));
    }
    const { _id } = decoded;
    const user = yield student_model_1.User.findById(_id);
    if (!user) {
        return next(new AppError_1.default(401, 'User not found'));
    }
    if (user.isDeleted) {
        return next(new AppError_1.default(403, 'User is deleted'));
    }
    if (user.status === student_constant_1.USER_STATUS.BLOCKED) {
        return next(new AppError_1.default(403, 'User is blocked'));
    }
    req.user = user;
    next();
}));
exports.default = verifyToken;
