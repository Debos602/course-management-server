import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrollmentServices } from './enrollment.service';

const enroll = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const courseId = req.params.id as string;
    const result = await EnrollmentServices.enroll(userId as string, courseId);
    sendResponse(res, result as any);
});

const myEnrollments = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const result = await EnrollmentServices.getEnrolledForUser(userId as string);
    sendResponse(res, result as any);
});

export const EnrollmentControllers = { enroll, myEnrollments };
