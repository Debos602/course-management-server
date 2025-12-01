"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const EnrollmentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    batch: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Batch' },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' }],
}, { timestamps: true });
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
exports.Enrollment = (0, mongoose_1.model)('Enrollment', EnrollmentSchema);
