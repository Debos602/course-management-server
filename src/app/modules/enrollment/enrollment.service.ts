import httpStatus from 'http-status';
import { Enrollment } from './enrollment.model';
import AppError from '../../errors/AppError';
import { Batch } from '../batch/batch.model';
import mongoose from 'mongoose';

export const EnrollmentServices = {
    enroll: async (userId: string, courseId: string) => {
        try {
            // Find an available batch for the course
            const batch = await Batch.aggregate([
                { $match: { course: new mongoose.Types.ObjectId(courseId) } },
                { $lookup: { from: 'enrollments', localField: '_id', foreignField: 'batch', as: 'enrollments' } },
                { $addFields: { availableSeats: { $subtract: ['$capacity', { $size: '$enrollments' }] } } },
                { $match: { availableSeats: { $gt: 0 } } },
                { $sort: { startDate: 1 } }, // Earliest starting batch first
                { $limit: 1 }
            ]);

            if (!batch || batch.length === 0) {
                throw new AppError(httpStatus.NOT_FOUND, 'No available batch for this course');
            }

            const selectedBatch = batch[0];

            const enrollment = await Enrollment.create({
                user: userId,
                course: courseId,
                batch: selectedBatch._id
            });

            // Update the batch to include the enrollment reference
            await Batch.findByIdAndUpdate(selectedBatch._id, { $push: { enrollments: enrollment._id } });

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
