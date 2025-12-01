import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { AdminControllers } from './admin.controller';

const router = express.Router();

router.route('/users/').get(auth(USER_ROLE.ADMIN), AdminControllers.getUsers);

router
    .route('/users/:id/delete')
    .delete(auth(USER_ROLE.ADMIN), AdminControllers.deleteUser);

router
    .route('/users/:id/make-admin')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.makeAdmin);

router
    .route('/users/:id/remove-admin')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.removeAdmin);

router
    .route('/users/:id/block')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.blockUser);

router
    .route('/users/:id/unblock')
    .put(auth(USER_ROLE.ADMIN), AdminControllers.unblockUser);

// Courses (admin)
router.route('/courses').get(auth(USER_ROLE.ADMIN), AdminControllers.getCourses);
router.route('/courses').post(auth(USER_ROLE.ADMIN), AdminControllers.createCourse);
router.route('/courses/:id').get(auth(USER_ROLE.ADMIN), AdminControllers.getCourse);
router.route('/courses/:id').put(auth(USER_ROLE.ADMIN), AdminControllers.updateCourse);
router.route('/courses/:id').delete(auth(USER_ROLE.ADMIN), AdminControllers.deleteCourse);

// Batches
router.route('/batches').post(auth(USER_ROLE.ADMIN), AdminControllers.createBatch);
router.route('/batches/:id').put(auth(USER_ROLE.ADMIN), AdminControllers.updateBatch);
router.route('/batches/:id').delete(auth(USER_ROLE.ADMIN), AdminControllers.deleteBatch);
router.route('/courses/:courseId/batches').get(auth(USER_ROLE.ADMIN), AdminControllers.getBatchesForCourse);

// Enrollments
router.route('/courses/:courseId/enrollments').get(auth(USER_ROLE.ADMIN), AdminControllers.getEnrollmentsForCourse);
router.route('/batches/:batchId/enrollments').get(auth(USER_ROLE.ADMIN), AdminControllers.getEnrollmentsForBatch);

// Assignment review
router.route('/courses/:courseId/assignments').get(auth(USER_ROLE.ADMIN), AdminControllers.getAssignmentsForCourse);



export const AdminRoutes = router;
