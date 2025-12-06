import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuizServices } from './quiz.service';

const createQuiz = catchAsync(async (req, res) => {
    const result = await QuizServices.createQuiz(req.body);
    sendResponse(res, result as any);
});

const getQuiz = catchAsync(async (req, res) => {
    const result = await QuizServices.getQuizById(req.params.courseId);
    sendResponse(res, result as any);
});

const submit = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const answers = req.body.answers as number[];

    const result = await QuizServices.submitQuiz(
        userId as string,
        req.params.id,
        answers
    );

    sendResponse(res, result as any);
});

export const QuizControllers = { createQuiz, getQuiz, submit };
