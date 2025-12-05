import httpStatus from 'http-status';
import { Enrollment } from './enrollment.model';
import AppError from '../../errors/AppError';

export const EnrollmentServices = {
    enroll: async (userId: string, courseId: string) => {
        try {
            const enrollment = await Enrollment.create({ user: userId, course: courseId });
            return { statusCode: httpStatus.CREATED, message: 'Enrolled', data: enrollment };
        } catch (err: any) {
            if (err.code === 11000) throw new AppError(httpStatus.BAD_REQUEST, 'Already enrolled');
            throw err;
        }
    },

    getEnrolledForUser: async (userId: string) => {
        const items = await Enrollment.find({ user: userId }).populate({ path: 'course', select: '-__v' });
        return { statusCode: httpStatus.OK, message: 'Enrollments fetched', data: items };
    },
    updateProgress: async (userId: string, courseId: string, payload: { progress?: number; completedLesson?: string; }) => {
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) throw new AppError(httpStatus.NOT_FOUND, 'Enrollment not found');

        const { progress, completedLesson } = payload || {};
        if (typeof progress === 'number') {
            enrollment.progress = Math.max(0, Math.min(100, progress));
        }

        if (completedLesson) {
            const exists = enrollment.completedLessons?.some((id: any) => id.toString() === completedLesson.toString());
            if (!exists) {
                enrollment.completedLessons = [...(enrollment.completedLessons || []), completedLesson as any];
            }
        }

        await enrollment.save();

        return { statusCode: httpStatus.OK, message: 'Progress updated', data: enrollment };
    },
};
