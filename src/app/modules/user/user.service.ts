import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendMail } from '../../utils/sendMail';
import { CONTACT_FORM_MESSAGE, USER_STATUS } from './user.constant';
import { IContactUsOptions, IUser } from './user.interface';
import { User } from './user.model';

const getUserFromDB = async (id: string) => {
    const user = await User.findById(id)
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: { path: 'author', select: 'name email avatarURL' },
            },
        })
        .populate('followers')
        .populate('following');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'User retrieved successfully',
        data: {
            ...user.toObject(),
            role: undefined,
            status: undefined,
            userType: undefined,
            updatedAt: undefined,
        },
    };
};



const getMeFromDB = async (id: mongoose.Types.ObjectId) => {
    const user = await User.findById(id)
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: { path: 'author', select: 'name email avatarURL' },
            },
        })
        .populate('followers')
        .populate('following');

    return {
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
};

const updateProfileIntoDB = async (
    id: mongoose.Types.ObjectId,
    payload: Partial<IUser>,
) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
};


const updateAvatar = async (
    id: mongoose.Types.ObjectId,
    avatarURL?: string,
) => {
    if (!avatarURL) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Avatar is required');
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { avatarURL },
        {
            new: true,
        },
    );

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Avatar uploaded successfully',
        data: updatedUser,
    };
};

export const UserServices = {
    getUserFromDB,

    getMeFromDB,
    updateProfileIntoDB,
    updateAvatar,
};
