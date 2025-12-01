"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const enrollment_controller_1 = require("./enrollment.controller");
const router = express_1.default.Router();
router.route('/:id/enroll').post((0, auth_1.default)(), enrollment_controller_1.EnrollmentControllers.enroll);
router.route('/mine').get((0, auth_1.default)(), enrollment_controller_1.EnrollmentControllers.myEnrollments);
exports.EnrollmentRoutes = router;
