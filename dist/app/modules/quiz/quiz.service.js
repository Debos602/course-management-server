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
const quiz_model_1 = require("./quiz.model");
const quizAttempt_model_1 = require("./quizAttempt.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.QuizServices = {
    getQuizById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const quiz = yield quiz_model_1.Quiz.findById(id).select('-__v');
        if (!quiz)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Quiz not found');
        return { statusCode: http_status_1.default.OK, message: 'Quiz fetched', data: quiz };
    }),
    submitQuiz: (userId, quizId, answers) => __awaiter(void 0, void 0, void 0, function* () {
        const quiz = yield quiz_model_1.Quiz.findById(quizId);
        if (!quiz)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Quiz not found');
        let score = 0;
        const questions = quiz.questions || [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (typeof q.correctAnswerIndex === 'number' && answers[i] === q.correctAnswerIndex) {
                score += q.marks || 1;
            }
        }
        const attempt = yield quizAttempt_model_1.QuizAttempt.create({ quiz: quizId, user: userId, answers, score, submittedAt: new Date() });
        return {
            statusCode: http_status_1.default.OK,
            message: 'Quiz submitted',
            data: { attemptId: attempt._id, score, total: questions.reduce((s, q) => s + (q.marks || 1), 0) },
        };
    }),
};
