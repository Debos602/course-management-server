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
    updateLesson: async (id: string, payload: Record<string, any>, file?: any) => {
        const lesson = await Lesson.findById(id);
        if (!lesson) throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');

        // attach uploaded video url if present
        if (file) {
            payload.videoURL = file.path || file.secure_url || file.url || payload.videoURL || '';
        }

        // if course is changing, update syllabus arrays
        if (payload.course && payload.course.toString() !== lesson.course.toString()) {
            const oldCourse = await Course.findById(lesson.course);
            const newCourse = await Course.findById(payload.course);
            if (!newCourse) throw new AppError(httpStatus.NOT_FOUND, 'New course not found');

            if (oldCourse) {
                oldCourse.syllabus = (oldCourse.syllabus || []).filter((l: any) => l.toString() !== lesson._id.toString());
                await oldCourse.save();
            }

            newCourse.syllabus = [...(newCourse.syllabus || []), lesson._id as any];
            await newCourse.save();
        }

        Object.assign(lesson, payload);
        await lesson.save();

        return {
            statusCode: httpStatus.OK,
            message: 'Lesson updated',
            data: lesson,
        };
    },

    deleteLesson: async (id: string) => {
        const lesson = await Lesson.findById(id);
        if (!lesson) throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');

        const course = await Course.findById(lesson.course);
        if (course) {
            course.syllabus = (course.syllabus || []).filter((l: any) => l.toString() !== lesson._id.toString());
            await course.save();
        }

        await Lesson.findByIdAndDelete(id);

        return {
            statusCode: httpStatus.OK,
            message: 'Lesson deleted',
            data: { id },
        };
    },
};
