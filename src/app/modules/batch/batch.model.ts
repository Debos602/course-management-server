import { Schema, model } from 'mongoose';
import { IBatch, BatchModel } from './batch.interface';

const BatchSchema = new Schema<IBatch, BatchModel>(
    {
        name: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
        startDate: { type: Date },
        endDate: { type: Date },
        instructor: { type: Schema.Types.ObjectId, ref: 'User' },
        students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        capacity: { type: Number },
    },
    { timestamps: true },
);

BatchSchema.index({ course: 1, name: 1 });

export const Batch = model<IBatch, BatchModel>('Batch', BatchSchema);
