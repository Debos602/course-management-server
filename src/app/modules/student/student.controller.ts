import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Route: /api/v1/users/:id (GET)
const getUser = catchAsync(async (req, res) => {
    const result = await UserServices.getUserFromDB(req.params.id);
    sendResponse(res, result);
});



// Route: /api/v1/users/me (GET)
const getMe = catchAsync(async (req, res) => {
    const result = await UserServices.getMeFromDB(req.user._id);
    sendResponse(res, result);
});

// Route: /api/users/me (PUT)
const updateProfile = catchAsync(async (req, res) => {
    const result = await UserServices.updateProfileIntoDB(
        req.user._id,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/users/avatar (POST)
const updateAvatar = catchAsync(async (req, res) => {
    const result = await UserServices.updateAvatar(
        req.user._id,
        req?.file?.path,
    );
    sendResponse(res, result);
});



export const UserControllers = {
    getUser,
    getMe,
    updateProfile,
    updateAvatar,
};
