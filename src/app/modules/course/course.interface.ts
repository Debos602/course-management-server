import mongoose, { Model } from 'mongoose';

export interface ICourse {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    instructor: mongoose.Types.ObjectId;
    instructorName: string;
    price: number;
    category?: string;
    tags: string[];
    syllabus: mongoose.Types.ObjectId[];
    rating: number;
    isPublished: boolean;
    thumbnailURL?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CourseModel extends Model<ICourse> { }
