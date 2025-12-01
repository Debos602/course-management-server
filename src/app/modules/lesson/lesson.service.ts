import httpStatus from 'http-status';
import { Lesson } from './lesson.model';
import AppError from '../../errors/AppError';

export const LessonServices = {
    getLessonById: async (id: string) => {
        const lesson = await Lesson.findById(id).select('-__v');
        if (!lesson) throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
        return {
            statusCode: httpStatus.OK,
            message: 'Lesson fetched',
            data: lesson,
        };
    },

    getLessonsByCourse: async (courseId: string) => {
        const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 }).select('-__v');
        return {
            statusCode: httpStatus.OK,
            message: 'Lessons fetched',
            data: lessons,
        };
    },
};
