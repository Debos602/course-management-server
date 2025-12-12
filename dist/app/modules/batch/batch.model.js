"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
// batch.schema.ts
const mongoose_1 = require("mongoose");
const batchSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    enrollments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'enrollments'
        }],
    capacity: {
        type: Number,
        default: 20,
        min: 1
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
// Virtual for batch status based on dates
batchSchema.virtual('status').get(function () {
    const now = new Date();
    const start = this.startDate;
    const end = this.endDate;
    if (now < start)
        return 'upcoming';
    if (now > end)
        return 'completed';
    return 'active';
});
// Virtual for enrollment count
batchSchema.virtual('enrollmentCount').get(function () {
    var _a;
    return ((_a = this.enrollments) === null || _a === void 0 ? void 0 : _a.length) || 0;
});
// Indexes
batchSchema.index({ course: 1 });
batchSchema.index({ startDate: 1 });
batchSchema.index({ status: 1 });
exports.Batch = (0, mongoose_1.model)('Batch', batchSchema);
