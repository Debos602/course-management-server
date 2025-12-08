// course.interface.ts
import { Model, Types } from 'mongoose';

export interface ICourse {
    title: string;
    description: string;
    instructorName: string;
    price: number;
    category: string;
    tags: string[];
    rating?: number;
    isPublished: boolean;
    thumbnailURL?: string;
    syllabus?: Types.ObjectId[];
}

export type CourseModel = Model<ICourse>;