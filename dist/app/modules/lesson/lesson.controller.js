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
exports.LessonControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const lesson_service_1 = require("./lesson.service");
const getLesson = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lesson_service_1.LessonServices.getLessonById(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
const getByCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lesson_service_1.LessonServices.getLessonsByCourse(req.params.courseId);
    (0, sendResponse_1.default)(res, result);
}));
const createLesson = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    // Support clients sending a JSON string in `body` (common for multipart requests)
    let payload = Object.assign({}, (req.body || {}));
    if (typeof payload.body === 'string') {
        try {
            const parsed = JSON.parse(payload.body);
            payload = Object.assign(Object.assign({}, payload), parsed);
        }
        catch (e) {
            // ignore parse errors
        }
    }
    // attach uploaded video url if present (multer-storage-cloudinary sets `path` or `secure_url`)
    const file = req.file;
    if (file) {
        payload.videoURL = file.path || file.secure_url || file.url || '';
    }
    console.log('Creating course lesson with payload:', payload);
    const result = yield lesson_service_1.LessonServices.createLessonForCourse(courseId, payload);
    (0, sendResponse_1.default)(res, result);
}));
exports.LessonControllers = {
    getLesson,
    getByCourse,
    createLesson,
};
