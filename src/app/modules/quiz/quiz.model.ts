import { Schema, model } from 'mongoose';
import { IQuiz, QuizModel, IQuestion } from './quiz.interface';

const QuestionSchema = new Schema<IQuestion>({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number },
    explanation: { type: String },
    marks: { type: Number, default: 1 },
});

const QuizSchema = new Schema<IQuiz, QuizModel>(
    {
        title: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
        questions: [QuestionSchema],
        durationMinutes: { type: Number },
        totalMarks: { type: Number },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true },
);

QuizSchema.index({ course: 1 });

export const Quiz = model<IQuiz, QuizModel>('Quiz', QuizSchema);
