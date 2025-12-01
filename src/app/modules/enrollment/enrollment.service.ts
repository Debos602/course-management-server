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
};
