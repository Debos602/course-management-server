import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LessonServices } from './lesson.service';

const getLesson = catchAsync(async (req, res) => {
    const result = await LessonServices.getLessonById(req.params.id);
    sendResponse(res, result as any);
});

const getByCourse = catchAsync(async (req, res) => {
    const result = await LessonServices.getLessonsByCourse(req.params.courseId);
    sendResponse(res, result as any);
});

export const LessonControllers = {
    getLesson,
    getByCourse,
};
