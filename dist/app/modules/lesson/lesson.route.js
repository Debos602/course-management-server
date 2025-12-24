"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lesson_controller_1 = require("./lesson.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const student_constant_1 = require("../student/student.constant");
const upload_1 = require("../../middlewares/upload");
const router = express_1.default.Router();
// Public: get lessons for a course
// Accept video upload when creating a lesson (field name: 'video')
router
    .route('/course/:courseId')
    .get(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.USER, student_constant_1.USER_ROLE.ADMIN), lesson_controller_1.LessonControllers.getByCourse)
    .post(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), upload_1.uploadVideo.single('videoURL'), lesson_controller_1.LessonControllers.createLesson);
// get all lessons
router
    .route('/')
    .get(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), lesson_controller_1.LessonControllers.getAllLessons);
// Get single lesson (requires enrollment in course normally; access control handled elsewhere)
router
    .route('/:id')
    .get(verifyToken_1.default, lesson_controller_1.LessonControllers.getLesson)
    .put(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), upload_1.uploadVideo.single('videoURL'), lesson_controller_1.LessonControllers.updateLesson)
    .delete(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), lesson_controller_1.LessonControllers.deleteLesson);
exports.LessonRoutes = router;
