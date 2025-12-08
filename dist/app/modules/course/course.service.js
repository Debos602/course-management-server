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
exports.CourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = require("./course.model");
const enrollment_model_1 = require("../enrollment/enrollment.model");
const lesson_model_1 = require("../lesson/lesson.model");
const assignment_model_1 = require("../assignment/assignment.model");
const quiz_model_1 = require("../quiz/quiz.model");
const quizAttempt_model_1 = require("../quiz/quizAttempt.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
exports.CourseServices = {
    getCourses: (query) => __awaiter(void 0, void 0, void 0, function* () {
        const page = Number(query.page) || DEFAULT_PAGE;
        const limit = Number(query.limit) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;
        const filter = { isPublished: true };
        if (query.search) {
            // text search
            filter.$text = { $search: query.search };
        }
        if (query.category) {
            filter.category = query.category;
        }
        if (query.tags) {
            const tags = query.tags.split(',').map((t) => t.trim());
            filter.tags = { $in: tags };
        }
        let sort = { createdAt: -1 };
        if (query.sort) {
            if (query.sort === 'price_asc')
                sort = { price: 1 };
            if (query.sort === 'price_desc')
                sort = { price: -1 };
        }
        const [total, items] = yield Promise.all([
            course_model_1.Course.countDocuments(filter),
            course_model_1.Course.find(filter).sort(sort).skip(skip).limit(limit).select('-__v'),
        ]);
        return {
            statusCode: http_status_1.default.OK,
            message: 'Courses fetched successfully',
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }),
    getCourseById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const course = yield course_model_1.Course.findById(id).populate({ path: 'syllabus', select: 'title videoURL order' }).select('-__v');
        if (!course) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
        }
        return {
            statusCode: http_status_1.default.OK,
            message: 'Course fetched successfully',
            data: course,
        };
    }),
    enrollInCourse: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You must be logged in to enroll');
        }
        // ensure course exists
        const course = yield course_model_1.Course.findById(courseId);
        if (!course)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
        // create enrollment (unique enforced)
        try {
            const enrollment = yield enrollment_model_1.Enrollment.create({ user: userId, course: courseId });
            return {
                statusCode: http_status_1.default.CREATED,
                message: 'Enrolled successfully',
                data: enrollment,
            };
        }
        catch (err) {
            // duplicate key means already enrolled
            if (err.code === 11000) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already enrolled');
            }
            throw err;
        }
    }),
    getEnrolledCourses: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const enrollments = yield enrollment_model_1.Enrollment.find({ user: userId }).populate({ path: 'course', select: '-__v' });
        const data = enrollments.map((e) => {
            var _a;
            return ({
                enrollmentId: e._id,
                course: e.course,
                progress: (_a = e.progress) !== null && _a !== void 0 ? _a : 0,
                status: e.status,
            });
        });
        return {
            statusCode: http_status_1.default.OK,
            message: 'Enrolled courses fetched',
            data,
        };
    }),
    getLessonForUser: (userId, courseId, lessonId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId)
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Login required');
        const enrollment = yield enrollment_model_1.Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not enrolled in this course');
        const lesson = yield lesson_model_1.Lesson.findById(lessonId).select('-__v');
        if (!lesson)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Lesson not found');
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson fetched',
            data: lesson,
        };
    }),
    markLessonComplete: (userId, courseId, lessonId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userId)
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Login required');
        const enrollment = yield enrollment_model_1.Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not enrolled in this course');
        const already = (enrollment.completedLessons || []).some((l) => l.toString() === lessonId);
        if (!already) {
            enrollment.completedLessons = [...(enrollment.completedLessons || []), lessonId];
            // compute progress based on course syllabus length
            const course = yield course_model_1.Course.findById(courseId).select('syllabus');
            const total = ((_a = course === null || course === void 0 ? void 0 : course.syllabus) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const completed = enrollment.completedLessons.length;
            enrollment.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            if (enrollment.progress >= 100)
                enrollment.status = 'completed';
            yield enrollment.save();
        }
        return {
            statusCode: http_status_1.default.OK,
            message: 'Lesson marked complete',
            data: { progress: enrollment.progress, completedLessons: enrollment.completedLessons },
        };
    }),
    submitAssignment: (userId, courseId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId)
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Login required');
        const enrollment = yield enrollment_model_1.Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not enrolled in this course');
        const assignment = yield assignment_model_1.Assignment.create({
            title: payload.title,
            description: payload.title,
            submissionLink: payload.submissionLink,
            textAnswer: payload.textAnswer,
            course: courseId,
            lesson: payload.lessonId,
            student: userId,
            submittedAt: new Date(),
        });
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Assignment submitted',
            data: assignment,
        };
    }),
    submitQuiz: (userId, courseId, quizId, answers) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId)
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Login required');
        const enrollment = yield enrollment_model_1.Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment)
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not enrolled in this course');
        const quiz = yield quiz_model_1.Quiz.findById(quizId);
        if (!quiz)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Quiz not found');
        let score = 0;
        const questions = quiz.questions || [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (typeof q.correctAnswerIndex === 'number' && answers[i] === q.correctAnswerIndex) {
                score += q.marks || 1;
            }
        }
        const attempt = yield quizAttempt_model_1.QuizAttempt.create({ quiz: quizId, user: userId, answers, score, submittedAt: new Date() });
        return {
            statusCode: http_status_1.default.OK,
            message: 'Quiz submitted',
            data: { attemptId: attempt._id, score, total: questions.reduce((s, q) => s + (q.marks || 1), 0) },
        };
    })
};
