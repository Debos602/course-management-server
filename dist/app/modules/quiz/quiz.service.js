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
exports.QuizServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const quiz_model_1 = require("./quiz.model");
const quizAttempt_model_1 = require("./quizAttempt.model");
exports.QuizServices = {
    // CREATE QUIZ
    createQuiz: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!payload.course) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Course is required");
        }
        if (!payload.title) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Quiz title is required");
        }
        if (!payload.questions || !Array.isArray(payload.questions)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Questions are required");
        }
        const totalMarks = payload.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
        const quiz = yield quiz_model_1.Quiz.create(Object.assign(Object.assign({}, payload), { totalMarks, isPublished: (_a = payload.isPublished) !== null && _a !== void 0 ? _a : false }));
        return {
            statusCode: http_status_1.default.CREATED,
            message: "Quiz created successfully",
            data: quiz,
        };
    }),
    // GET QUIZ
    getQuizById: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const quiz = yield quiz_model_1.Quiz.findOne({ course: courseId });
        if (!quiz)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Quiz not found');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Quiz fetched',
            data: quiz,
        };
    }),
    // SUBMIT QUIZ
    submitQuiz: (userId, quizId, answers) => __awaiter(void 0, void 0, void 0, function* () {
        const quiz = yield quiz_model_1.Quiz.findById(quizId);
        if (!quiz)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Quiz not found');
        let score = 0;
        quiz.questions.forEach((q, i) => {
            if (typeof q.correctAnswerIndex === 'number' &&
                answers[i] === q.correctAnswerIndex) {
                score += q.marks || 1;
            }
        });
        const attempt = yield quizAttempt_model_1.QuizAttempt.create({
            quiz: quizId,
            user: userId,
            answers,
            score,
            submittedAt: new Date(),
        });
        const totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
        return {
            statusCode: http_status_1.default.OK,
            message: 'Quiz submitted',
            data: {
                attemptId: attempt._id,
                score,
                total: totalMarks,
            },
        };
    }),
};
