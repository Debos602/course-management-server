"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_constant_1 = require("./student.constant");
const student_controller_1 = require("./student.controller");
const student_validation_1 = require("./student.validation");
const router = express_1.default.Router();
router
    .route('/me')
    .get((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN, student_constant_1.USER_ROLE.USER), student_controller_1.UserControllers.getMe)
    .put((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN, student_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(student_validation_1.UserValidations.updateProfileValidationSchema), student_controller_1.UserControllers.updateProfile);
router
    .route('/avatar')
    .post((0, auth_1.default)(student_constant_1.USER_ROLE.ADMIN, student_constant_1.USER_ROLE.USER), upload_1.upload.single('avatar'), student_controller_1.UserControllers.updateAvatar);
router.route('/:id').get(student_controller_1.UserControllers.getUser);
exports.UserRoutes = router;
