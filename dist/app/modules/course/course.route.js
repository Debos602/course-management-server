"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const course_controller_1 = require("./course.controller");
const router = express_1.default.Router();
// Public listing with optional token to identify user
router.route('/').get(verifyToken_1.default, course_controller_1.CourseControllers.getCourses);
// Course details
router.route('/:id').get(verifyToken_1.default, course_controller_1.CourseControllers.getCourse);
// Student protected endpoints
router.route('/enrolled').get((0, auth_1.default)(), course_controller_1.CourseControllers.getEnrolled);
// Enroll (requires auth)
router.route('/:id/enroll').post((0, auth_1.default)(), course_controller_1.CourseControllers.enroll);
// Lesson access & mark complete
router.route('/:id/lessons/:lessonId').get((0, auth_1.default)(), course_controller_1.CourseControllers.getLesson);
router.route('/:id/lessons/:lessonId/complete').post((0, auth_1.default)(), course_controller_1.CourseControllers.markComplete);
// Assignments
router.route('/:id/assignments').post((0, auth_1.default)(), course_controller_1.CourseControllers.submitAssignment);
// Quizzes
router.route('/:id/quizzes/:quizId/submit').post((0, auth_1.default)(), course_controller_1.CourseControllers.submitQuiz);
exports.CourseRoutes = router;
