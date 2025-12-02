import express from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './student.constant';
import { UserControllers } from './student.controller';
import { UserValidations } from './student.validation';

const router = express.Router();

router
    .route('/me')
    .get(auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.getMe)
    .put(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(UserValidations.updateProfileValidationSchema),
        UserControllers.updateProfile,
    );
router
    .route('/avatar')
    .post(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        upload.single('avatar'),
        UserControllers.updateAvatar,
    );



router.route('/:id').get(UserControllers.getUser);


export const UserRoutes = router;
