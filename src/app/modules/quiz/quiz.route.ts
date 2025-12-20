import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { QuizControllers } from './quiz.controller';
import { USER_ROLE } from '../student/student.constant';

const router = express.Router();

router.route('/').post(verifyToken, auth(USER_ROLE.ADMIN), QuizControllers.createQuiz);
router.route('/').get(verifyToken, auth(USER_ROLE.ADMIN), QuizControllers.getAllQuizzes);
// Get quiz by course id
router.get('/:courseId', QuizControllers.getQuiz);

// Submit attempt
router.route('/:id/submit').post(verifyToken, auth(), QuizControllers.submit);

// Update & delete (admin only)
router.route('/:id').put(auth(USER_ROLE.ADMIN), QuizControllers.updateQuiz).delete(auth(USER_ROLE.ADMIN), QuizControllers.deleteQuiz);

export const QuizRoutes = router;
