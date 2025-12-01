"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAttempt = void 0;
const mongoose_1 = require("mongoose");
const QuizAttemptSchema = new mongoose_1.Schema({
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [{ type: Number }],
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
QuizAttemptSchema.index({ quiz: 1, user: 1 });
exports.QuizAttempt = (0, mongoose_1.model)('QuizAttempt', QuizAttemptSchema);
