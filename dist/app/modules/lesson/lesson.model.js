"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const LessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    videoURL: { type: String, required: true },
    duration: { type: Number },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    resources: [{ type: String }],
}, { timestamps: true });
exports.Lesson = (0, mongoose_1.model)('Lesson', LessonSchema);
