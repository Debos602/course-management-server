import { Schema, model } from 'mongoose';
import { IEnrollment, EnrollmentModel } from './enrollment.interface';

const enrollmentSchema = new Schema<IEnrollment, EnrollmentModel>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
        batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
        status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    },
    { timestamps: true },
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = model<IEnrollment, EnrollmentModel>(
    'Enrollment',
    enrollmentSchema
);

