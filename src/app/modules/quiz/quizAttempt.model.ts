import { Schema, model } from 'mongoose';
import { IQuizAttempt, QuizAttemptModel } from './quizAttempt.interface';

const QuizAttemptSchema = new Schema<IQuizAttempt, QuizAttemptModel>(
    {
        quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        answers: [{ type: Number }],
        score: { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

QuizAttemptSchema.index({ quiz: 1, user: 1 });

export const QuizAttempt = model<IQuizAttempt, QuizAttemptModel>('QuizAttempt', QuizAttemptSchema);
