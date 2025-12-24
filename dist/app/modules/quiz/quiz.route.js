"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const quiz_controller_1 = require("./quiz.controller");
const student_constant_1 = require("../student/student.constant");
const router = express_1.default.Router();
router.route('/').post(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), quiz_controller_1.QuizControllers.createQuiz);
router.route('/').get(verifyToken_1.default, (0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), quiz_controller_1.QuizControllers.getAllQuizzes);
// Get quiz by course id
router.get('/:courseId', quiz_controller_1.QuizControllers.getQuiz);
// Submit attempt
router.route('/:id/submit').post(verifyToken_1.default, (0, auth_1.default)(), quiz_controller_1.QuizControllers.submit);
// Update & delete (admin only)
router.route('/:id').put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), quiz_controller_1.QuizControllers.updateQuiz).delete((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN), quiz_controller_1.QuizControllers.deleteQuiz);
exports.QuizRoutes = router;
