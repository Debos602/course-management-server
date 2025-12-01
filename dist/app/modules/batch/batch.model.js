"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const mongoose_1 = require("mongoose");
const BatchSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    capacity: { type: Number },
}, { timestamps: true });
BatchSchema.index({ course: 1, name: 1 });
exports.Batch = (0, mongoose_1.model)('Batch', BatchSchema);
