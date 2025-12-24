"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const assignment_controller_1 = require("./assignment.controller");
const student_constant_1 = require("../student/student.constant");
const router = express_1.default.Router();
router.route('/').post((0, auth_1.default)(student_constant_1.USER_ROLE.USER), assignment_controller_1.AssignmentControllers.submit);
router.route('/mine').get((0, auth_1.default)(), assignment_controller_1.AssignmentControllers.myAssignments);
exports.AssignmentRoutes = router;
