"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const student_constant_1 = require("../student/student.constant");
const admin_controller_1 = require("./admin.controller");
const upload_1 = require("../../middlewares/upload");
const router = express_1.default.Router();
router.route('/users/').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getUsers);
router
    .route('/users/:id/delete')
    .delete((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.deleteUser);
router
    .route('/users/:id/make-admin')
    .put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.makeAdmin);
router
    .route('/users/:id/remove-admin')
    .put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.removeAdmin);
router
    .route('/users/:id/block')
    .put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.blockUser);
router
    .route('/users/:id/unblock')
    .put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.unblockUser);
// Courses (admin)
router.route('/courses').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getCourses);
router.route('/courses').post((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), upload_1.upload.single('thumbnailURL'), admin_controller_1.AdminControllers.createCourse);
router.route('/courses/:id').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getCourse);
router.route('/courses/:id').put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.updateCourse);
router.route('/courses/:id').delete((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.deleteCourse);
// Batches
router.route('/batches').post((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.createBatch);
router.route('/all-batches').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getAllBatches);
router.route('/batches/:id').put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.updateBatch);
router.route('/batches/:id').delete((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.deleteBatch);
router.route('/courses/:courseId/batches').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getBatchesForCourse);
router.route('/batches/:batchId').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getBatchById);
// Enrollments
router.route('/courses/:courseId/enrollments').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getEnrollmentsForCourse);
router.route('/batches/:batchId/enrollments').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getEnrollmentsForBatch);
router.route('/enrollments').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getAllEnrollments);
// Assignment review
router.route('/courses/:courseId/assignments').get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getAssignmentsForCourse);
exports.AdminRoutes = router;
