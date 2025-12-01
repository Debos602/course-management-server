import { Schema, model } from 'mongoose';
import { ICourse, CourseModel } from './course.interface';

const CourseSchema = new Schema<ICourse, CourseModel>(
    {
        title: { type: String, required: true },
        description: { type: String },
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        instructorName: { type: String, required: true },
        price: { type: Number, default: 0 },
        category: { type: String, index: true },
        tags: [{ type: String, index: true }],
        syllabus: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        rating: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: true },
        thumbnailURL: { type: String },
    },
    { timestamps: true },
);

CourseSchema.index({ title: 1 });
CourseSchema.index({ instructorName: 1 });
CourseSchema.index({ tags: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text', instructorName: 'text' });

export const Course = model<ICourse, CourseModel>('Course', CourseSchema);
