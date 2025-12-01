import mongoose, { Model } from 'mongoose';

export interface IQuizAttempt {
    _id: mongoose.Types.ObjectId;
    quiz: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    answers: number[]; // index of selected option per question
    score: number;
    submittedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface QuizAttemptModel extends Model<IQuizAttempt> { }
