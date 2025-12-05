import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/student/student.route';
import { CourseRoutes } from '../modules/course/course.route';
import { LessonRoutes } from '../modules/lesson/lesson.route';
import { AssignmentRoutes } from '../modules/assignment/assignment.route';
import { QuizRoutes } from '../modules/quiz/quiz.route';
import { EnrollmentRoutes } from '../modules/enrollment/enrollment.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/courses', route: CourseRoutes },
    { path: '/lessons', route: LessonRoutes },
    { path: '/assignments', route: AssignmentRoutes },
    { path: '/quizzes', route: QuizRoutes },
    { path: '/enrollments', route: EnrollmentRoutes },
    { path: '/admin', route: AdminRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
