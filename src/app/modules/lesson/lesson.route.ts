import express from 'express';
import { LessonControllers } from './lesson.controller';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';

const router = express.Router();

// Public: get lessons for a course
router.route('/course/:courseId').get(verifyToken, LessonControllers.getByCourse);

// Get single lesson (requires enrollment in course normally; access control handled elsewhere)
router.route('/:id').get(verifyToken, LessonControllers.getLesson);

export const LessonRoutes = router;
