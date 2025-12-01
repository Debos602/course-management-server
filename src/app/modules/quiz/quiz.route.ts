import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import auth from '../../middlewares/auth';
import { QuizControllers } from './quiz.controller';

const router = express.Router();

router.route('/:id').get(verifyToken, QuizControllers.getQuiz);
router.route('/:id/submit').post(auth(), QuizControllers.submit);

export const QuizRoutes = router;
