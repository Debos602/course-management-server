"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const student_constant_1 = require("../student/student.constant");
const course_controller_1 = require("./course.controller");
const lesson_controller_1 = require("../lesson/lesson.controller");
const upload_1 = require("../../middlewares/upload");
const router = express_1.default.Router();
// Public listing with optional token to identify user
router.route('/').get(course_controller_1.CourseControllers.getCourses).post((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), upload_1.upload.any(), course_controller_1.CourseControllers.createCourse);
// Create course (admin) with thumbnail upload
router.post('/create-course', (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), upload_1.upload.any(), course_controller_1.CourseControllers.createCourse);
// Course details
router.route('/:id').get(verifyToken_1.default, course_controller_1.CourseControllers.getCourse).put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN, student_constant_1.USER_ROLE.USER), course_controller_1.CourseControllers.updateCourse).delete((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), course_controller_1.CourseControllers.deleteCourse);
// Alias: get all lessons for a course via /courses/:id/lessons
router.get('/:id/lessons', verifyToken_1.default, (req, res, next) => {
    // forward param name expected by LessonControllers.getByCourse
    req.params.courseId = req.params.id;
    return lesson_controller_1.LessonControllers.getByCourse(req, res, next);
});
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
