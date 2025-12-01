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
const router = express_1.default.Router();
router.route('/:id').get(verifyToken_1.default, quiz_controller_1.QuizControllers.getQuiz);
router.route('/:id/submit').post((0, auth_1.default)(), quiz_controller_1.QuizControllers.submit);
exports.QuizRoutes = router;
