"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const AssignmentSchema = new mongoose_1.Schema({
    title: { type: String },
    description: { type: String },
    submissionLink: { type: String },
    textAnswer: { type: String },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    submittedAt: { type: Date },
    grade: { type: Number },
    feedback: { type: String },
    attachments: [{ type: String }],
}, { timestamps: true });
AssignmentSchema.index({ course: 1, student: 1 });
exports.Assignment = (0, mongoose_1.model)('Assignment', AssignmentSchema);
