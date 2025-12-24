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
exports.AdminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
// Route: /api/v1/admin/users/ (GET)
const getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/delete (DELETE)
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deleteUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/make-admin (PUT)
const makeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.makeAdminIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/remove-admin (PUT)
const removeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.removeAdminFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/block (PUT)
const blockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.blockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/unblock (PUT)
const unblockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.unblockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Courses
const createCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = req.body.payload;
    // form-data হলে payload string আসে → JSON.parse প্রয়োজন
    if (typeof payload === 'string') {
        payload = JSON.parse(payload);
    }
    // image থাকলে সেটা যোগ করুন
    if (req.file) {
        payload.thumbnailURL = req.file.path;
    }
    const result = yield admin_service_1.AdminServices.createCourseInDB(payload);
    (0, sendResponse_1.default)(res, result);
}));
const updateCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.updateCourseInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
const deleteCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deleteCourseInDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
const getCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getCoursesFromDBAdmin(req.query);
    (0, sendResponse_1.default)(res, result);
}));
const getCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getCourseByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Batches
const createBatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.createBatchInDB(req.body);
    (0, sendResponse_1.default)(res, result);
}));
const getAllBatches = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllBatches();
    (0, sendResponse_1.default)(res, result);
}));
const updateBatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.updateBatchInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
const deleteBatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deleteBatchInDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
const getBatchesForCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getBatchesForCourse(req.params.courseId);
    (0, sendResponse_1.default)(res, result);
}));
const getBatchById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getBatchById(req.params.batchId);
    (0, sendResponse_1.default)(res, result);
}));
// Enrollments
const getEnrollmentsForCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getEnrollmentsByCourse(req.params.courseId);
    (0, sendResponse_1.default)(res, result);
}));
const getEnrollmentsForBatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getEnrollmentsByBatch(req.params.batchId);
    (0, sendResponse_1.default)(res, result);
}));
const getAllEnrollments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllEnrollments();
    (0, sendResponse_1.default)(res, result);
}));
// Assignment review
const getAssignmentsForCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAssignmentsForCourse(req.params.courseId);
    (0, sendResponse_1.default)(res, result);
}));
exports.AdminControllers = {
    getUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser,
    // courses
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourse,
    // batches
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchesForCourse,
    getAllBatches,
    getBatchById,
    // enrollments
    getEnrollmentsForCourse,
    getEnrollmentsForBatch,
    getAllEnrollments,
    // assignments
    getAssignmentsForCourse,
};
