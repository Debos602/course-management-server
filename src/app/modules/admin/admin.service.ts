import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_ROLE, USER_STATUS } from '../student/student.constant';
import { User } from '../student/student.model';
import { Course } from '../course/course.model';
import { Batch } from '../batch/batch.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { Assignment } from '../assignment/assignment.model';


const getUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();

    return {
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
};

const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // TODO:check other conditions for not deleting

    // delete the user
    const deletedUser = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete user!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    };
};

const makeAdminIntoDB = async (id: string) => {
    const user = await User.findById(id);

    // check if the user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check if the user is blocked
    if (user.status === USER_STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
    }

    if (user.role === USER_ROLE.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already an admin!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { role: USER_ROLE.ADMIN },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

const removeAdminFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.role !== USER_ROLE.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is not an admin!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { role: USER_ROLE.USER },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

const blockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.status === USER_STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already blocked!');
    }

    const result = await User.findByIdAndUpdate(
        id,
        {
            status: USER_STATUS.BLOCKED,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User is blocked successfully!',
        data: result,
    };
};

const unblockUserIntoDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.status === USER_STATUS.ACTIVE) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User is already unblocked!',
        );
    }

    const result = await User.findByIdAndUpdate(
        id,
        {
            status: USER_STATUS.ACTIVE,
        },
        { new: true },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'User is unblocked successfully!',
        data: result,
    };
};

// Course Management
const createCourseInDB = async (payload: Record<string, any>) => {
    const course = await Course.create(payload);
    return { statusCode: httpStatus.CREATED, message: 'Course created', data: course };
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

// Batch Management
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

// Enrollment management
const getEnrollmentsByCourse = async (courseId: string) => {
    const enrollments = await Enrollment.find({ course: courseId }).populate({ path: 'user', select: 'name email' });
    return { statusCode: httpStatus.OK, message: 'Enrollments fetched', data: enrollments };
};

const getEnrollmentsByBatch = async (batchId: string) => {
    const enrollments = await Enrollment.find({ batch: batchId }).populate({ path: 'user', select: 'name email' });
    return { statusCode: httpStatus.OK, message: 'Enrollments fetched', data: enrollments };
};

// Assignment review
const getAssignmentsForCourse = async (courseId: string) => {
    const assignments = await Assignment.find({ course: courseId }).populate({ path: 'student', select: 'name email' });
    return { statusCode: httpStatus.OK, message: 'Assignments fetched', data: assignments };
};





export const AdminServices = {

    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB
    ,
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
    // enrollments
    getEnrollmentsByCourse,
    getEnrollmentsByBatch,
    // assignments
    getAssignmentsForCourse,
};

