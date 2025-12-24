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
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const student_constant_1 = require("../student/student.constant");
const student_model_1 = require("../student/student.model");
const course_model_1 = require("../course/course.model");
const batch_model_1 = require("../batch/batch.model");
const enrollment_model_1 = require("../enrollment/enrollment.model");
const assignment_model_1 = require("../assignment/assignment.model");
// -------------------- USERS --------------------
const getUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(student_model_1.User.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const users = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return { statusCode: http_status_1.default.OK, message: 'Users retrieved successfully', data: users, meta };
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield student_model_1.User.findById(id);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    const deletedUser = yield student_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return { statusCode: http_status_1.default.OK, message: 'User deleted successfully', data: deletedUser };
});
const makeAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield student_model_1.User.findById(id);
    if (!user || user.isDeleted)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    if (user.status === student_constant_1.USER_STATUS.BLOCKED)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked!');
    if (user.role === student_constant_1.USER_ROLE.ADMIN)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already an admin!');
    const result = yield student_model_1.User.findByIdAndUpdate(id, { role: student_constant_1.USER_ROLE.ADMIN }, { new: true });
    return { statusCode: http_status_1.default.OK, message: 'User role updated successfully!', data: result };
});
const removeAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield student_model_1.User.findById(id);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    if (user.role !== student_constant_1.USER_ROLE.ADMIN)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is not an admin!');
    const result = yield student_model_1.User.findByIdAndUpdate(id, { role: student_constant_1.USER_ROLE.USER }, { new: true });
    return { statusCode: http_status_1.default.OK, message: 'User role updated successfully!', data: result };
});
const blockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield student_model_1.User.findById(id);
    if (!user || user.isDeleted)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    if (user.status === student_constant_1.USER_STATUS.BLOCKED)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already blocked!');
    const result = yield student_model_1.User.findByIdAndUpdate(id, { status: student_constant_1.USER_STATUS.BLOCKED }, { new: true });
    return { statusCode: http_status_1.default.OK, message: 'User is blocked successfully!', data: result };
});
const unblockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield student_model_1.User.findById(id);
    if (!user || user.isDeleted)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    if (user.status === student_constant_1.USER_STATUS.ACTIVE)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already unblocked!');
    const result = yield student_model_1.User.findByIdAndUpdate(id, { status: student_constant_1.USER_STATUS.ACTIVE }, { new: true });
    return { statusCode: http_status_1.default.OK, message: 'User is unblocked successfully!', data: result };
});
// -------------------- COURSES --------------------
const createCourseInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const course = yield course_model_1.Course.create([payload], { session });
        // Automatically create Batch
        const existingBatchCount = yield batch_model_1.Batch.find();
        const batchName = `${course[0].title} — Batch ${existingBatchCount.length + 1}`;
        const defaultBatch = yield batch_model_1.Batch.create([{
                name: batchName,
                course: course[0]._id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                capacity: 20,
                students: []
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return { statusCode: http_status_1.default.CREATED, message: 'Course & Batch created successfully', data: { course: course[0], batch: defaultBatch[0] } };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create course & batch');
    }
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
// -------------------- BATCHES --------------------
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
const getAllBatches = () => __awaiter(void 0, void 0, void 0, function* () {
    const batches = yield batch_model_1.Batch.find().select('-__v')
        .populate({
        path: 'course',
        model: 'Course',
        select: 'title instructorName thumbnailURL'
    })
        .lean();
    // Populate enrollments for each batch
    const batchesWithEnrollments = yield Promise.all(batches.map((batch) => __awaiter(void 0, void 0, void 0, function* () {
        const enrollments = yield enrollment_model_1.Enrollment.find({ batch: batch._id })
            .populate('user', 'name email avatar phone')
            .lean();
        const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
        return Object.assign(Object.assign({}, batch), { enrollments, enrollmentStats: {
                total: enrollments.length,
                active: activeEnrollments,
                capacity: batch.capacity || 20,
                availableSeats: Math.max(0, (batch.capacity || 20) - enrollments.length)
            } });
    })));
    return { statusCode: http_status_1.default.OK, message: 'All Batches fetched', data: batchesWithEnrollments };
});
const getBatchById = (batchId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(batchId)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid batch ID');
    }
    const batch = yield batch_model_1.Batch.findById(batchId)
        .populate({
        path: 'course', // must match schema field
        model: 'Course', // must match registered model name
        select: 'title description instructorName price category thumbnailURL isPublished',
    })
        .populate({
        path: 'enrollments', // field in Batch schema
        model: 'Enrollment', // registered model name
        select: 'user status enrolledAt progress',
    })
        .lean();
    if (!batch)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Batch not found');
    const enrollments = yield enrollment_model_1.Enrollment.find({ batch: batch._id })
        .populate('user', 'name email avatar phone')
        .lean();
    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    const now = new Date();
    const start = new Date(batch.startDate);
    const end = new Date(batch.endDate);
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();
    const progress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100)) : 0;
    const formattedBatch = Object.assign(Object.assign({}, batch), { _id: batch._id.toString(), enrollments, enrollmentStats: {
            total: enrollments.length,
            active: activeEnrollments,
            capacity: batch.capacity || 20,
            availableSeats: Math.max(0, (batch.capacity || 20) - enrollments.length)
        }, progress: Math.round(progress), durationInDays: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) });
    return { statusCode: http_status_1.default.OK, message: 'Batch fetched successfully', data: formattedBatch };
});
// -------------------- ENROLLMENTS --------------------
const getEnrollmentsByCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollments = yield enrollment_model_1.Enrollment.find({ course: courseId }).populate('user', 'name email');
    return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: enrollments };
});
const getEnrollmentsByBatch = (batchId) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollments = yield enrollment_model_1.Enrollment.find({ batch: batchId }).populate('user', 'name email');
    return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: enrollments };
});
const getAllEnrollments = () => __awaiter(void 0, void 0, void 0, function* () {
    const enrollments = yield enrollment_model_1.Enrollment.find().populate('user', 'name email');
    return { statusCode: http_status_1.default.OK, message: 'All Enrollments fetched', data: enrollments };
});
// -------------------- ASSIGNMENTS --------------------
const getAssignmentsForCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignments = yield assignment_model_1.Assignment.find({ course: courseId }).populate('student', 'name email');
    return { statusCode: http_status_1.default.OK, message: 'Assignments fetched', data: assignments };
});
// -------------------- EXPORT --------------------
exports.AdminServices = {
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
