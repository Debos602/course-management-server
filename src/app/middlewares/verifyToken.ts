import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { USER_STATUS } from '../modules/student/student.constant';
import { User } from '../modules/student/student.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';

const verifyToken = catchAsync(async (req, _res, next) => {
    const token = req.headers?.authorization?.split?.(' ')?.[1];

    if (!token) {
        return next(new AppError(401, 'No token provided'));
    }

    let decoded;
    try {
        decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;
    } catch (error) {
        return next(new AppError(401, 'Invalid or expired token'));
    }

    const { _id } = decoded;
    const user = await User.findById(_id);

    if (!user) {
        return next(new AppError(401, 'User not found'));
    }

    if (user.isDeleted) {
        return next(new AppError(403, 'User is deleted'));
    }

    if (user.status === USER_STATUS.BLOCKED) {
        return next(new AppError(403, 'User is blocked'));
    }

    req.user = user;
    next();
});


export default verifyToken;
