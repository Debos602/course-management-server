import mongoose, { Model } from 'mongoose';

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswerIndex?: number;
    explanation?: string;
    marks?: number;
}

export interface IQuiz {
    _id: mongoose.Types.ObjectId;
    title: string;
    course: mongoose.Types.ObjectId;
    questions: IQuestion[];
    durationMinutes?: number;
    totalMarks?: number;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface QuizModel extends Model<IQuiz> { }
