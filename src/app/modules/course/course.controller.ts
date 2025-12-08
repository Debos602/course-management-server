import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { AdminServices } from '../admin/admin.service';
import AppError from '../../errors/AppError';

const getCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getCourses(req.query);
    sendResponse(res, result as any);
});

const getCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.getCourseById(req.params.id);
    sendResponse(res, result as any);
});

const enroll = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const result = await CourseServices.enrollInCourse(userId, req.params.id);
    sendResponse(res, result as any);
});

const getEnrolled = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const result = await CourseServices.getEnrolledCourses(userId as string);
    sendResponse(res, result as any);
});

const getLesson = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, lessonId } = req.params as any;
    const result = await CourseServices.getLessonForUser(userId, courseId, lessonId);
    sendResponse(res, result as any);
});

const markComplete = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, lessonId } = req.params as any;
    const result = await CourseServices.markLessonComplete(userId, courseId, lessonId);
    sendResponse(res, result as any);
});

const submitAssignment = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const courseId = req.params.id as string;
    const payload = req.body;
    const result = await CourseServices.submitAssignment(userId, courseId, payload);
    sendResponse(res, result as any);
});

const submitQuiz = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, quizId } = req.params as any;
    const answers = req.body.answers as number[];
    const result = await CourseServices.submitQuiz(userId, courseId, quizId, answers);
    sendResponse(res, result as any);
});

export const CourseControllers = {
    getCourses,
    getCourse,
    enroll,
    getEnrolled,
    getLesson,
    markComplete,
    submitAssignment,
    submitQuiz


};
