"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    syllabus: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' }],
    rating: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    thumbnailURL: { type: String },
}, { timestamps: true });
CourseSchema.index({ title: 1 });
CourseSchema.index({ instructorName: 1 });
CourseSchema.index({ tags: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text', instructorName: 'text' });
exports.Course = (0, mongoose_1.model)('Course', CourseSchema);
