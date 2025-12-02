"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/student/user.route");
const course_route_1 = require("../modules/course/course.route");
const lesson_route_1 = require("../modules/lesson/lesson.route");
const assignment_route_1 = require("../modules/assignment/assignment.route");
const quiz_route_1 = require("../modules/quiz/quiz.route");
const enrollment_route_1 = require("../modules/enrollment/enrollment.route");
const router = express_1.default.Router();
const routes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/courses', route: course_route_1.CourseRoutes },
    { path: '/lessons', route: lesson_route_1.LessonRoutes },
    { path: '/assignments', route: assignment_route_1.AssignmentRoutes },
    { path: '/quizzes', route: quiz_route_1.QuizRoutes },
    { path: '/enrollments', route: enrollment_route_1.EnrollmentRoutes },
    { path: '/admin', route: admin_route_1.AdminRoutes },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
