import httpStatus from 'http-status';
import { Quiz } from './quiz.model';
import { QuizAttempt } from './quizAttempt.model';
import AppError from '../../errors/AppError';

export const QuizServices = {
    getQuizById: async (id: string) => {
        const quiz = await Quiz.findById(id).select('-__v');
        if (!quiz) throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');
        return { statusCode: httpStatus.OK, message: 'Quiz fetched', data: quiz };
    },

    submitQuiz: async (userId: string, quizId: string, answers: number[]) => {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');

        let score = 0;
        const questions = quiz.questions || [];
        for (let i = 0;i < questions.length;i++) {
            const q: any = questions[i];
            if (typeof q.correctAnswerIndex === 'number' && answers[i] === q.correctAnswerIndex) {
                score += q.marks || 1;
            }
        }

        const attempt = await QuizAttempt.create({ quiz: quizId, user: userId, answers, score, submittedAt: new Date() });

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz submitted',
            data: { attemptId: attempt._id, score, total: questions.reduce((s: number, q: any) => s + (q.marks || 1), 0) },
        };
    },
};
