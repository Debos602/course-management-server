"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course.service");
const getCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.getCourses(req.query);
    (0, sendResponse_1.default)(res, result);
}));
const getCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_service_1.CourseServices.getCourseById(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
const enroll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
    const result = yield course_service_1.CourseServices.enrollInCourse(userId, req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
const getEnrolled = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString();
    const result = yield course_service_1.CourseServices.getEnrolledCourses(userId);
    (0, sendResponse_1.default)(res, result);
}));
const getLesson = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const userId = (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString();
    const { id: courseId, lessonId } = req.params;
    const result = yield course_service_1.CourseServices.getLessonForUser(userId, courseId, lessonId);
    (0, sendResponse_1.default)(res, result);
}));
const markComplete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const userId = (_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g._id) === null || _h === void 0 ? void 0 : _h.toString();
    const { id: courseId, lessonId } = req.params;
    const result = yield course_service_1.CourseServices.markLessonComplete(userId, courseId, lessonId);
    (0, sendResponse_1.default)(res, result);
}));
const submitAssignment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    const userId = (_k = (_j = req.user) === null || _j === void 0 ? void 0 : _j._id) === null || _k === void 0 ? void 0 : _k.toString();
    const courseId = req.params.id;
    const payload = req.body;
    const result = yield course_service_1.CourseServices.submitAssignment(userId, courseId, payload);
    (0, sendResponse_1.default)(res, result);
}));
const submitQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m;
    const userId = (_m = (_l = req.user) === null || _l === void 0 ? void 0 : _l._id) === null || _m === void 0 ? void 0 : _m.toString();
    const { id: courseId, quizId } = req.params;
    const answers = req.body.answers;
    const result = yield course_service_1.CourseServices.submitQuiz(userId, courseId, quizId, answers);
    (0, sendResponse_1.default)(res, result);
}));
exports.CourseControllers = {
    getCourses,
    getCourse,
    enroll,
    getEnrolled,
    getLesson,
    markComplete,
    submitAssignment,
    submitQuiz
};
