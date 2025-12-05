import express from 'express';
import { LessonControllers } from './lesson.controller';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../student/student.constant';
import { uploadVideo } from '../../middlewares/upload';

const router = express.Router();

// Public: get lessons for a course
// Accept video upload when creating a lesson (field name: 'video')
router.route('/course/:courseId').get(auth(USER_ROLE.USER, USER_ROLE.ADMIN), verifyToken, LessonControllers.getByCourse).post(auth(USER_ROLE.ADMIN), uploadVideo.single('videoURL'), LessonControllers.createLesson);

// Get single lesson (requires enrollment in course normally; access control handled elsewhere)
router.route('/:id').get(verifyToken, LessonControllers.getLesson);

export const LessonRoutes = router;
