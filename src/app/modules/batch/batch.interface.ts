import mongoose, { Model } from 'mongoose';

export interface IBatch {
    _id: mongoose.Types.ObjectId;
    name: string;
    course: mongoose.Types.ObjectId;
    startDate?: Date;
    endDate?: Date;
    instructor?: mongoose.Types.ObjectId;
    students?: mongoose.Types.ObjectId[];
    capacity?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BatchModel extends Model<IBatch> { }
