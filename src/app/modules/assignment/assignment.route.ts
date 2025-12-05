import express from 'express';
import auth from '../../middlewares/auth';
import { AssignmentControllers } from './assignment.controller';
import { USER_ROLE } from '../student/student.constant';

const router = express.Router();

router.route('/').post(auth(USER_ROLE.USER), AssignmentControllers.submit);
router.route('/mine').get(auth(), AssignmentControllers.myAssignments);

export const AssignmentRoutes = router;
