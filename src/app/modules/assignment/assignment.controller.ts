import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AssignmentServices } from './assignment.service';

const submit = catchAsync(async (req, res) => {
    const student = req.user?._id?.toString();
    const payload = { ...(req.body || {}), student };
    const result = await AssignmentServices.submitAssignment(payload as any);
    sendResponse(res, result as any);
});

const myAssignments = catchAsync(async (req, res) => {
    const student = req.user?._id?.toString();
    const result = await AssignmentServices.getAssignmentsForStudent(student as string);
    sendResponse(res, result as any);
});

export const AssignmentControllers = { submit, myAssignments };
