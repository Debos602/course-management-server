import express from 'express';
import auth from '../../middlewares/auth';
import { EnrollmentControllers } from './enrollment.controller';

const router = express.Router();

router.route('/:id/enroll').post(auth(), EnrollmentControllers.enroll);
router.route('/mine').get(auth(), EnrollmentControllers.myEnrollments);

export const EnrollmentRoutes = router;
