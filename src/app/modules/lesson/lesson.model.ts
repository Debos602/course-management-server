import { Schema, model } from 'mongoose';
import { ILesson, LessonModel } from './lesson.interface';

const LessonSchema = new Schema<ILesson, LessonModel>(
    {
        title: { type: String, required: true },
        videoURL: { type: String, required: true },
        duration: { type: Number },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        order: { type: Number, default: 0 },
        resources: [{ type: String }],
    },
    { timestamps: true },
);

export const Lesson = model<ILesson, LessonModel>('Lesson', LessonSchema);
