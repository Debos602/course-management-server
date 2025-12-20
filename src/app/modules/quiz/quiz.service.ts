import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Quiz } from './quiz.model';
import { QuizAttempt } from './quizAttempt.model';

export const QuizServices = {
    // CREATE QUIZ
    createQuiz: async (payload: any) => {
        if (!payload.course) {
            throw new AppError(httpStatus.BAD_REQUEST, "Course is required");
        }

        if (!payload.title) {
            throw new AppError(httpStatus.BAD_REQUEST, "Quiz title is required");
        }

        if (!payload.questions || !Array.isArray(payload.questions)) {
            throw new AppError(httpStatus.BAD_REQUEST, "Questions are required");
        }

        const totalMarks = payload.questions.reduce(
            (sum: number, q: any) => sum + (q.marks || 1),
            0
        );

        const quiz = await Quiz.create({
            ...payload,
            totalMarks,
            isPublished: payload.isPublished ?? false,
        });

        return {
            statusCode: httpStatus.CREATED,
            message: "Quiz created successfully",
            data: quiz,
        };
    },

    // GET ALL QUIZZES
    getAllQuizzes: async () => {
        const quizzes = await Quiz.find();
        return {
            statusCode: httpStatus.OK,
            message: 'Quizzes fetched',
            data: quizzes,
        };
    }
    ,

    // GET QUIZ
    getQuizById: async (courseId: string) => {
        const quiz = await Quiz.findOne({ course: courseId });
        if (!quiz) throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz fetched',
            data: quiz,
        };
    },


    // SUBMIT QUIZ
    submitQuiz: async (userId: string, quizId: string, answers: number[]) => {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');

        let score = 0;

        quiz.questions.forEach((q: any, i: number) => {
            if (
                typeof q.correctAnswerIndex === 'number' &&
                answers[i] === q.correctAnswerIndex
            ) {
                score += q.marks || 1;
            }
        });

        const attempt = await QuizAttempt.create({
            quiz: quizId,
            user: userId,
            answers,
            score,
            submittedAt: new Date(),
        });

        const totalMarks = quiz.questions.reduce(
            (sum, q: any) => sum + (q.marks || 1),
            0
        );

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz submitted',
            data: {
                attemptId: attempt._id,
                score,
                total: totalMarks,
            },
        };
    },
    updateQuiz: async (id: string, payload: any) => {
        const quiz = await Quiz.findById(id);
        if (!quiz) throw new AppError(404, 'Quiz not found');

        if (payload.questions && Array.isArray(payload.questions)) {
            const totalMarks = payload.questions.reduce(
                (sum: number, q: any) => sum + (q.marks || 1),
                0,
            );
            payload.totalMarks = totalMarks;
        }

        Object.assign(quiz, payload);
        await quiz.save();

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz updated',
            data: quiz,
        };
    },

    deleteQuiz: async (id: string) => {
        const quiz = await Quiz.findById(id);
        if (!quiz) throw new AppError(404, 'Quiz not found');

        await Quiz.findByIdAndDelete(id);

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz deleted',
            data: { id },
        };
    },
};
