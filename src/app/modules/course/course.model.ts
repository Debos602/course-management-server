// course.model.ts
import { Schema, model } from 'mongoose';
import { ICourse, CourseModel } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
    {
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
                type: Schema.Types.ObjectId,
                ref: 'Lesson',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// For text search
courseSchema.index({ title: 'text', description: 'text' });

export const Course = model<ICourse, CourseModel>('Course', courseSchema);