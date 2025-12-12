import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_ROLE, USER_STATUS } from '../student/student.constant';
import { User } from '../student/student.model';
import { Course } from '../course/course.model';
import { Batch } from '../batch/batch.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { Assignment } from '../assignment/assignment.model';
import { ICourse } from '../course/course.interface';

// -------------------- USERS --------------------
const getUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();

    return { statusCode: httpStatus.OK, message: 'Users retrieved successfully', data: users, meta };
};

const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

    const deletedUser = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return { statusCode: httpStatus.OK, message: 'User deleted successfully', data: deletedUser };
};

const makeAdminIntoDB = async (id: string) => {
    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    if (user.status === USER_STATUS.BLOCKED) throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
    if (user.role === USER_ROLE.ADMIN) throw new AppError(httpStatus.BAD_REQUEST, 'User is already an admin!');

    const result = await User.findByIdAndUpdate(id, { role: USER_ROLE.ADMIN }, { new: true });
    return { statusCode: httpStatus.OK, message: 'User role updated successfully!', data: result };
};

const removeAdminFromDB = async (id: string) => {
    const user = await User.findById(id);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    if (user.role !== USER_ROLE.ADMIN) throw new AppError(httpStatus.BAD_REQUEST, 'User is not an admin!');

    const result = await User.findByIdAndUpdate(id, { role: USER_ROLE.USER }, { new: true });
    return { statusCode: httpStatus.OK, message: 'User role updated successfully!', data: result };
};

const blockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    if (user.status === USER_STATUS.BLOCKED) throw new AppError(httpStatus.BAD_REQUEST, 'User is already blocked!');

    const result = await User.findByIdAndUpdate(id, { status: USER_STATUS.BLOCKED }, { new: true });
    return { statusCode: httpStatus.OK, message: 'User is blocked successfully!', data: result };
};

const unblockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);
    if (!user || user.isDeleted) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    if (user.status === USER_STATUS.ACTIVE) throw new AppError(httpStatus.BAD_REQUEST, 'User is already unblocked!');

    const result = await User.findByIdAndUpdate(id, { status: USER_STATUS.ACTIVE }, { new: true });
    return { statusCode: httpStatus.OK, message: 'User is unblocked successfully!', data: result };
};

// -------------------- COURSES --------------------
const createCourseInDB = async (payload: ICourse) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const course = await Course.create([payload], { session });

        // Automatically create Batch
        const existingBatchCount = await Batch.find();
        const batchName = `${course[0].title} — Batch ${existingBatchCount.length + 1}`;
        const defaultBatch = await Batch.create([{
            name: batchName,
            course: course[0]._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            capacity: 20,
            students: []
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return { statusCode: httpStatus.CREATED, message: 'Course & Batch created successfully', data: { course: course[0], batch: defaultBatch[0] } };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create course & batch');
    }
};

const updateCourseInDB = async (id: string, payload: Record<string, any>) => {
    const course = await Course.findByIdAndUpdate(id, payload, { new: true });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    return { statusCode: httpStatus.OK, message: 'Course updated', data: course };
};

const deleteCourseInDB = async (id: string) => {
    const course = await Course.findByIdAndDelete(id);
    if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    return { statusCode: httpStatus.OK, message: 'Course deleted', data: course };
};

const getCoursesFromDBAdmin = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find(), query).filter().sort().paginate().fields();
    const items = await courseQuery.modelQuery;
    const meta = await courseQuery.countTotal();
    return { statusCode: httpStatus.OK, message: 'Courses fetched', data: items, meta };
};

const getCourseByIdFromDB = async (id: string) => {
    const course = await Course.findById(id).populate({ path: 'syllabus' });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    return { statusCode: httpStatus.OK, message: 'Course fetched', data: course };
};

// -------------------- BATCHES --------------------
const createBatchInDB = async (payload: Record<string, any>) => {
    const batch = await Batch.create(payload);
    return { statusCode: httpStatus.CREATED, message: 'Batch created', data: batch };
};

const updateBatchInDB = async (id: string, payload: Record<string, any>) => {
    const batch = await Batch.findByIdAndUpdate(id, payload, { new: true });
    if (!batch) throw new AppError(httpStatus.NOT_FOUND, 'Batch not found');
    return { statusCode: httpStatus.OK, message: 'Batch updated', data: batch };
};

const deleteBatchInDB = async (id: string) => {
    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) throw new AppError(httpStatus.NOT_FOUND, 'Batch not found');
    return { statusCode: httpStatus.OK, message: 'Batch deleted', data: batch };
};

const getBatchesForCourse = async (courseId: string) => {
    const batches = await Batch.find({ course: courseId }).select('-__v');
    return { statusCode: httpStatus.OK, message: 'Batches fetched', data: batches };
};

const getAllBatches = async () => {
    const batches = await Batch.find().select('-__v')
        .populate({
            path: 'course',
            model: 'Course',
            select: 'title instructorName thumbnailURL'
        })
        .lean();

    // Populate enrollments for each batch
    const batchesWithEnrollments = await Promise.all(batches.map(async batch => {
        const enrollments = await Enrollment.find({ batch: batch._id })
            .populate('user', 'name email avatar phone')
            .lean();

        const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

        return {
            ...batch,
            enrollments,
            enrollmentStats: {
                total: enrollments.length,
                active: activeEnrollments,
                capacity: batch.capacity || 20,
                availableSeats: Math.max(0, (batch.capacity || 20) - enrollments.length)
            }
        };
    }));

    return { statusCode: httpStatus.OK, message: 'All Batches fetched', data: batchesWithEnrollments };
};

const getBatchById = async (batchId: string) => {
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid batch ID');
    }

    const batch = await Batch.findById(batchId)
        .populate({
            path: 'course',           // must match schema field
            model: 'Course',          // must match registered model name
            select: 'title description instructorName price category thumbnailURL isPublished',
        })
        .populate({
            path: 'enrollments',      // field in Batch schema
            model: 'Enrollment',      // registered model name
            select: 'user status enrolledAt progress',
        })
        .lean();

    if (!batch) throw new AppError(httpStatus.NOT_FOUND, 'Batch not found');

    const enrollments = await Enrollment.find({ batch: batch._id })
        .populate('user', 'name email avatar phone')
        .lean();

    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

    const now = new Date();
    const start = new Date(batch.startDate);
    const end = new Date(batch.endDate);
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();
    const progress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100)) : 0;

    const formattedBatch = {
        ...batch,
        _id: batch._id.toString(),
        enrollments,
        enrollmentStats: {
            total: enrollments.length,
            active: activeEnrollments,
            capacity: batch.capacity || 20,
            availableSeats: Math.max(0, (batch.capacity || 20) - enrollments.length)
        },
        progress: Math.round(progress),
        durationInDays: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    };

    return { statusCode: httpStatus.OK, message: 'Batch fetched successfully', data: formattedBatch };
};

// -------------------- ENROLLMENTS --------------------
const getEnrollmentsByCourse = async (courseId: string) => {
    const enrollments = await Enrollment.find({ course: courseId }).populate('user', 'name email');
    return { statusCode: httpStatus.OK, message: 'Enrollments fetched', data: enrollments };
};

const getEnrollmentsByBatch = async (batchId: string) => {
    const enrollments = await Enrollment.find({ batch: batchId }).populate('user', 'name email');
    return { statusCode: httpStatus.OK, message: 'Enrollments fetched', data: enrollments };
};

const getAllEnrollments = async () => {
    const enrollments = await Enrollment.find().populate('user', 'name email');
    return { statusCode: httpStatus.OK, message: 'All Enrollments fetched', data: enrollments };
};

// -------------------- ASSIGNMENTS --------------------
const getAssignmentsForCourse = async (courseId: string) => {
    const assignments = await Assignment.find({ course: courseId }).populate('student', 'name email');
    return { statusCode: httpStatus.OK, message: 'Assignments fetched', data: assignments };
};

// -------------------- EXPORT --------------------
export const AdminServices = {
    // users
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    // courses
    createCourseInDB,
    updateCourseInDB,
    deleteCourseInDB,
    getCoursesFromDBAdmin,
    getCourseByIdFromDB,
    // batches
    createBatchInDB,
    updateBatchInDB,
    deleteBatchInDB,
    getBatchesForCourse,
    getAllBatches,
    getBatchById,
    // enrollments
    getEnrollmentsByCourse,
    getEnrollmentsByBatch,
    getAllEnrollments,
    // assignments
    getAssignmentsForCourse
};
