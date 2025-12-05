import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../student/student.constant';
import { CourseControllers } from './course.controller';
import { upload } from '../../middlewares/upload';

const router = express.Router();

// Public listing with optional token to identify user
router.route('/').get(verifyToken, CourseControllers.getCourses).post(auth(USER_ROLE.ADMIN), upload.any(), CourseControllers.createCourse);

// Create course (admin) with thumbnail upload
router.post(
    '/create-course',
    auth(USER_ROLE.ADMIN),
    upload.any(),
    CourseControllers.createCourse,
);

// Course details
router.route('/:id').get(verifyToken, CourseControllers.getCourse).put(auth(USER_ROLE.ADMIN), CourseControllers.updateCourse).delete(auth(USER_ROLE.ADMIN), CourseControllers.deleteCourse);

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
