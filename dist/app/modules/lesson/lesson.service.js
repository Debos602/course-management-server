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
exports.LessonServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lesson_model_1 = require("./lesson.model");
const course_model_1 = require("../course/course.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.LessonServices = {
    getLessonById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield lesson_model_1.Lesson.findById(id).select('-__v');
        if (!lesson)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lesson not found');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson fetched',
            data: lesson,
        };
    }),
    getLessonsByCourse: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const lessons = yield lesson_model_1.Lesson.find({ course: courseId }).sort({ order: 1 }).select('-__v');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lessons fetched',
            data: lessons,
        };
    }),
    createLessonForCourse: (courseId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        // ensure course exists
        const course = yield course_model_1.Course.findById(courseId);
        if (!course)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
        // set the course on payload
        const lesson = yield lesson_model_1.Lesson.create(Object.assign(Object.assign({}, payload), { course: courseId }));
        // add to course syllabus if not already present
        course.syllabus = [...(course.syllabus || []), lesson._id];
        yield course.save();
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Lesson created',
            data: lesson,
        };
    }),
    updateLesson: (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield lesson_model_1.Lesson.findById(id);
        if (!lesson)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lesson not found');
        // attach uploaded video url if present
        if (file) {
            payload.videoURL = file.path || file.secure_url || file.url || payload.videoURL || '';
        }
        // if course is changing, update syllabus arrays
        if (payload.course && payload.course.toString() !== lesson.course.toString()) {
            const oldCourse = yield course_model_1.Course.findById(lesson.course);
            const newCourse = yield course_model_1.Course.findById(payload.course);
            if (!newCourse)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'New course not found');
            if (oldCourse) {
                oldCourse.syllabus = (oldCourse.syllabus || []).filter((l) => l.toString() !== lesson._id.toString());
                yield oldCourse.save();
            }
            newCourse.syllabus = [...(newCourse.syllabus || []), lesson._id];
            yield newCourse.save();
        }
        Object.assign(lesson, payload);
        yield lesson.save();
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson updated',
            data: lesson,
        };
    }),
    deleteLesson: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield lesson_model_1.Lesson.findById(id);
        if (!lesson)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lesson not found');
        const course = yield course_model_1.Course.findById(lesson.course);
        if (course) {
            course.syllabus = (course.syllabus || []).filter((l) => l.toString() !== lesson._id.toString());
            yield course.save();
        }
        yield lesson_model_1.Lesson.findByIdAndDelete(id);
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson deleted',
            data: { id },
        };
    }),
};
