"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const QuestionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number },
    explanation: { type: String },
    marks: { type: Number, default: 1 },
});
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    questions: [QuestionSchema],
    durationMinutes: { type: Number },
    totalMarks: { type: Number },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });
QuizSchema.index({ course: 1 });
exports.Quiz = (0, mongoose_1.model)('Quiz', QuizSchema);
