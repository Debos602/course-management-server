// batch.schema.ts
import { Schema, model } from 'mongoose';
import { IBatch, BatchModel } from './batch.interface';


const batchSchema = new Schema<IBatch, BatchModel>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        course: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref: 'enrollments'
        }],
        capacity: {
            type: Number,
            default: 20,
            min: 1
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

// Virtual for batch status based on dates
batchSchema.virtual('status').get(function () {
    const now = new Date();
    const start = this.startDate;
    const end = this.endDate;

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
});

// Virtual for enrollment count
batchSchema.virtual('enrollmentCount').get(function () {
    return this.enrollments?.length || 0;
});

// Indexes
batchSchema.index({ course: 1 });
batchSchema.index({ startDate: 1 });
batchSchema.index({ status: 1 });

export const Batch = model<IBatch, BatchModel>('Batch', batchSchema);