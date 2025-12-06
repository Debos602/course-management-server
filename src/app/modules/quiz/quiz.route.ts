import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { QuizControllers } from './quiz.controller';

const router = express.Router();

router.route('/').post(auth("admin"), QuizControllers.createQuiz);
// routes.ts
router.get('/:courseId', QuizControllers.getQuiz);

router.route('/:id/submit').post(auth(), QuizControllers.submit);

export const QuizRoutes = router;
