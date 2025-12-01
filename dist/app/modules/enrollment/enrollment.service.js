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
exports.EnrollmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enrollment_model_1 = require("./enrollment.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.EnrollmentServices = {
    enroll: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const enrollment = yield enrollment_model_1.Enrollment.create({ user: userId, course: courseId });
            return { statusCode: http_status_1.default.CREATED, message: 'Enrolled', data: enrollment };
        }
        catch (err) {
            if (err.code === 11000)
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Already enrolled');
            throw err;
        }
    }),
    getEnrolledForUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield enrollment_model_1.Enrollment.find({ user: userId }).populate({ path: 'course', select: '-__v' });
        return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: items };
    }),
};
