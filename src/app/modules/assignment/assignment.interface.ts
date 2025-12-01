import mongoose, { Model } from 'mongoose';

export interface IAssignment {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    submissionLink?: string;
    textAnswer?: string;
    course: mongoose.Types.ObjectId;
    lesson?: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    submittedAt?: Date;
    grade?: number;
    feedback?: string;
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AssignmentModel extends Model<IAssignment> { }
