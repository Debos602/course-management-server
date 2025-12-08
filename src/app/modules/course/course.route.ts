import express from 'express';
import auth from '../../middlewares/auth';
import { CourseControllers } from './course.controller';
import { LessonControllers } from '../lesson/lesson.controller';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

// GET all courses
router.get('/', CourseControllers.getCourses);

// Course details
router
    .route('/:id')
    .get(verifyToken, CourseControllers.getCourse);


// Lessons
router.get('/:id/lessons', verifyToken, (req, res, next) => {
    req.params.courseId = req.params.id;
    return LessonControllers.getByCourse(req as any, res as any, next);
});

// Student endpoints
router.get('/enrolled', auth(), CourseControllers.getEnrolled);
router.post('/:id/enroll', auth(), CourseControllers.enroll);

// Lesson access
router.get('/:id/lessons/:lessonId', auth(), CourseControllers.getLesson);
router.post('/:id/lessons/:lessonId/complete', auth(), CourseControllers.markComplete);

// Assignments
router.post('/:id/assignments', auth(), CourseControllers.submitAssignment);

// Quizzes
router.post('/:id/quizzes/:quizId/submit', auth(), CourseControllers.submitQuiz);

export const CourseRoutes = router;
