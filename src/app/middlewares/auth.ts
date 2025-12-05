import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { USER_STATUS } from '../modules/student/student.constant';
import { IUserRole } from '../modules/student/student.interface';
import { User } from '../modules/student/student.model';
import catchAsync from '../utils/catchAsync';

const auth = (...authorizedRoles: IUserRole[]): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const authHeader = req.headers.authorization;

        // check if auth header is sent
        if (!authHeader) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // get the token from the auth header
        const token = authHeader.split(' ')[1];

        // check if there is a token
        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // decode the token
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { _id } = decoded;

        const user = await User.findById(_id);

        // check if user exists
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if the user is deleted
        if (user.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if the user is blocked
        if (user.status === USER_STATUS.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
        }

        // normalize legacy role values (some records may still have 'user')
        const rawRole = (user as any).role;
        const normalizedRole = (rawRole === 'user' ? 'student' : rawRole) as IUserRole;

        // check if the user is authorized (only enforce when roles were passed)
        if (authorizedRoles && authorizedRoles.length > 0 && !authorizedRoles.includes(normalizedRole)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // attach normalized role on the user object so downstream code sees consistent values
        (user as any).role = normalizedRole;
        req.user = user;
        next();
    });
};

export default auth;
