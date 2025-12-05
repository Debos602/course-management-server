import mongoose, { Model } from 'mongoose';

export interface ILesson {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    videoURL: string;
    duration?: number;
    course: mongoose.Types.ObjectId;
    order?: number;
    resources?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LessonModel extends Model<ILesson> { }
