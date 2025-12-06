"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enrollment_controller_1 = require("./enrollment.controller");
const student_constant_1 = require("../student/student.constant");
const router = express_1.default.Router();
router.route('/:id/enroll').post(enrollment_controller_1.EnrollmentControllers.enroll);
router.route('/:id/progress').patch((0, auth_1.default)(student_constant_1.USER_ROLE.USER), enrollment_controller_1.EnrollmentControllers.updateProgress);
router.route('/mine').get((0, auth_1.default)(student_constant_1.USER_ROLE.USER), enrollment_controller_1.EnrollmentControllers.myEnrollments);
exports.EnrollmentRoutes = router;
