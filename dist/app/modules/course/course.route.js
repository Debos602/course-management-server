"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const course_controller_1 = require("./course.controller");
const lesson_controller_1 = require("../lesson/lesson.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
// GET all courses
router.get('/', course_controller_1.CourseControllers.getCourses);
// Course details
router
    .route('/:id')
    .get(verifyToken_1.default, course_controller_1.CourseControllers.getCourse);
// Lessons
router.get('/:id/lessons', verifyToken_1.default, (req, res, next) => {
    req.params.courseId = req.params.id;
    return lesson_controller_1.LessonControllers.getByCourse(req, res, next);
});
// Student endpoints
router.get('/enrolled', (0, auth_1.default)(), course_controller_1.CourseControllers.getEnrolled);
router.post('/:id/enroll', (0, auth_1.default)(), course_controller_1.CourseControllers.enroll);
// Lesson access
router.get('/:id/lessons/:lessonId', (0, auth_1.default)(), course_controller_1.CourseControllers.getLesson);
router.post('/:id/lessons/:lessonId/complete', (0, auth_1.default)(), course_controller_1.CourseControllers.markComplete);
// Assignments
router.post('/:id/assignments', (0, auth_1.default)(), course_controller_1.CourseControllers.submitAssignment);
// Quizzes
router.post('/:id/quizzes/:quizId/submit', (0, auth_1.default)(), course_controller_1.CourseControllers.submitQuiz);
exports.CourseRoutes = router;
