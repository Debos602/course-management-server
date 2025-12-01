import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { CourseControllers } from './course.controller';

const router = express.Router();

// Public listing with optional token to identify user
router.route('/').get(verifyToken, CourseControllers.getCourses);

// Course details
router.route('/:id').get(verifyToken, CourseControllers.getCourse);

// Student protected endpoints
router.route('/enrolled').get(auth(), CourseControllers.getEnrolled);

// Enroll (requires auth)
router.route('/:id/enroll').post(auth(), CourseControllers.enroll);

// Lesson access & mark complete
router.route('/:id/lessons/:lessonId').get(auth(), CourseControllers.getLesson);
router.route('/:id/lessons/:lessonId/complete').post(auth(), CourseControllers.markComplete);

// Assignments
router.route('/:id/assignments').post(auth(), CourseControllers.submitAssignment);

// Quizzes
router.route('/:id/quizzes/:quizId/submit').post(auth(), CourseControllers.submitQuiz);

export const CourseRoutes = router;
