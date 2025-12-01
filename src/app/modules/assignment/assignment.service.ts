import httpStatus from 'http-status';
import { Assignment } from './assignment.model';
import AppError from '../../errors/AppError';

export const AssignmentServices = {
    submitAssignment: async (payload: {
        title: string;
        submissionLink?: string;
        textAnswer?: string;
        course: string;
        lesson?: string;
        student: string;
    }) => {
        const assignment = await Assignment.create({
            title: payload.title,
            submissionLink: payload.submissionLink,
            textAnswer: payload.textAnswer,
            course: payload.course,
            lesson: payload.lesson,
            student: payload.student,
            submittedAt: new Date(),
        });

        return {
            statusCode: httpStatus.CREATED,
            message: 'Assignment submitted',
            data: assignment,
        };
    },

    getAssignmentsForStudent: async (studentId: string) => {
        const items = await Assignment.find({ student: studentId }).select('-__v');
        return { statusCode: httpStatus.OK, message: 'Assignments fetched', data: items };
    },
};
