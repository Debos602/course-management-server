import express from 'express';
import auth from '../../middlewares/auth';
import { AssignmentControllers } from './assignment.controller';

const router = express.Router();

router.route('/').post(auth(), AssignmentControllers.submit);
router.route('/mine').get(auth(), AssignmentControllers.myAssignments);

export const AssignmentRoutes = router;
