import mongoose, { Model } from 'mongoose';

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled';

export interface IEnrollment {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    batch?: mongoose.Types.ObjectId;
    status: EnrollmentStatus;
    enrolledAt?: Date;
    progress: number;
    completedLessons?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EnrollmentModel extends Model<IEnrollment> { }
