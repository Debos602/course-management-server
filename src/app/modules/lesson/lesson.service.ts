import httpStatus from 'http-status';
import { Lesson } from './lesson.model';
import { Course } from '../course/course.model';
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
    createLessonForCourse: async (courseId: string, payload: Record<string, any>) => {
        // ensure course exists
        const course = await Course.findById(courseId);
        if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');

        // set the course on payload
        const lesson = await Lesson.create({ ...payload, course: courseId });

        // add to course syllabus if not already present
        course.syllabus = [...(course.syllabus || []), lesson._id as any];
        await course.save();

        return {
            statusCode: httpStatus.CREATED,
            message: 'Lesson created',
            data: lesson,
        };
    },
};
