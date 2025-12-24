"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
// course.model.ts
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    rating: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    thumbnailURL: {
        type: String,
    },
    syllabus: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Lesson',
        },
    ],
}, {
    timestamps: true,
});
// For text search
courseSchema.index({ title: 'text', description: 'text' });
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
