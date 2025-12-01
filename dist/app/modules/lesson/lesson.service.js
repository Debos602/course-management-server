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
exports.LessonServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lesson_model_1 = require("./lesson.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.LessonServices = {
    getLessonById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield lesson_model_1.Lesson.findById(id).select('-__v');
        if (!lesson)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lesson not found');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson fetched',
            data: lesson,
        };
    }),
    getLessonsByCourse: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const lessons = yield lesson_model_1.Lesson.find({ course: courseId }).sort({ order: 1 }).select('-__v');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lessons fetched',
            data: lessons,
        };
    }),
};
