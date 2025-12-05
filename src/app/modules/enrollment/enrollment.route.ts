import express from 'express';
import auth from '../../middlewares/auth';
import { EnrollmentControllers } from './enrollment.controller';
import { USER_ROLE } from '../student/student.constant';

const router = express.Router();

router.route('/:id/enroll').post(auth(USER_ROLE.USER), EnrollmentControllers.enroll);
router.route('/:id/progress').patch(auth(USER_ROLE.USER), EnrollmentControllers.updateProgress);
router.route('/mine').get(auth(USER_ROLE.USER), EnrollmentControllers.myEnrollments);

export const EnrollmentRoutes = router;
