"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const course_model_1 = require("../course/course.model");
const batch_model_1 = require("../batch/batch.model");
const enrollment_model_1 = require("../enrollment/enrollment.model");
const assignment_model_1 = require("../assignment/assignment.model");
const getUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const users = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return {
        statusCode: http_status_1.default.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // TODO:check other conditions for not deleting
    // delete the user
    const deletedUser = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete user!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    };
});
const makeAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    // check if the user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is blocked
    if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked!');
    }
    if (user.role === user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already an admin!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.ADMIN }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const removeAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.role !== user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is not an admin!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.USER }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const blockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already blocked!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        status: user_constant_1.USER_STATUS.BLOCKED,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User is blocked successfully!',
        data: result,
    };
});
const unblockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.status === user_constant_1.USER_STATUS.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already unblocked!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        status: user_constant_1.USER_STATUS.ACTIVE,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User is unblocked successfully!',
        data: result,
    };
});
// Course Management
const createCourseInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.create(payload);
    return { statusCode: http_status_1.default.CREATED, message: 'Course created', data: course };
});
const updateCourseInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findByIdAndUpdate(id, payload, { new: true });
    if (!course)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    return { statusCode: http_status_1.default.OK, message: 'Course updated', data: course };
});
const deleteCourseInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findByIdAndDelete(id);
    if (!course)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    return { statusCode: http_status_1.default.OK, message: 'Course deleted', data: course };
});
const getCoursesFromDBAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_model_1.Course.find(), query).filter().sort().paginate().fields();
    const items = yield courseQuery.modelQuery;
    const meta = yield courseQuery.countTotal();
    return { statusCode: http_status_1.default.OK, message: 'Courses fetched', data: items, meta };
});
const getCourseByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById(id).populate({ path: 'syllabus' });
    if (!course)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    return { statusCode: http_status_1.default.OK, message: 'Course fetched', data: course };
});
// Batch Management
const createBatchInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const batch = yield batch_model_1.Batch.create(payload);
    return { statusCode: http_status_1.default.CREATED, message: 'Batch created', data: batch };
});
const updateBatchInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const batch = yield batch_model_1.Batch.findByIdAndUpdate(id, payload, { new: true });
    if (!batch)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Batch not found');
    return { statusCode: http_status_1.default.OK, message: 'Batch updated', data: batch };
});
const deleteBatchInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const batch = yield batch_model_1.Batch.findByIdAndDelete(id);
    if (!batch)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Batch not found');
    return { statusCode: http_status_1.default.OK, message: 'Batch deleted', data: batch };
});
const getBatchesForCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const batches = yield batch_model_1.Batch.find({ course: courseId }).select('-__v');
    return { statusCode: http_status_1.default.OK, message: 'Batches fetched', data: batches };
});
// Enrollment management
const getEnrollmentsByCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollments = yield enrollment_model_1.Enrollment.find({ course: courseId }).populate({ path: 'user', select: 'name email' });
    return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: enrollments };
});
const getEnrollmentsByBatch = (batchId) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollments = yield enrollment_model_1.Enrollment.find({ batch: batchId }).populate({ path: 'user', select: 'name email' });
    return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: enrollments };
});
// Assignment review
const getAssignmentsForCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignments = yield assignment_model_1.Assignment.find({ course: courseId }).populate({ path: 'student', select: 'name email' });
    return { statusCode: http_status_1.default.OK, message: 'Assignments fetched', data: assignments };
});
exports.AdminServices = {
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
    // enrollments
    getEnrollmentsByCourse,
    getEnrollmentsByBatch,
    // assignments
    getAssignmentsForCourse,
};
