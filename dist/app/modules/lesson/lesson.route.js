"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lesson_controller_1 = require("./lesson.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
// Public: get lessons for a course
router.route('/course/:courseId').get(verifyToken_1.default, lesson_controller_1.LessonControllers.getByCourse);
// Get single lesson (requires enrollment in course normally; access control handled elsewhere)
router.route('/:id').get(verifyToken_1.default, lesson_controller_1.LessonControllers.getLesson);
exports.LessonRoutes = router;
