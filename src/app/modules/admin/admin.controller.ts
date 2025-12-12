import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';



// Route: /api/v1/admin/users/ (GET)
const getUsers = catchAsync(async (req, res) => {
    const result = await AdminServices.getUsersFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/delete (DELETE)
const deleteUser = catchAsync(async (req, res) => {
    const result = await AdminServices.deleteUserFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/make-admin (PUT)
const makeAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.makeAdminIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/remove-admin (PUT)
const removeAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.removeAdminFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/block (PUT)
const blockUser = catchAsync(async (req, res) => {
    const result = await AdminServices.blockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/unblock (PUT)
const unblockUser = catchAsync(async (req, res) => {
    const result = await AdminServices.unblockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Courses
const createCourse = catchAsync(async (req, res) => {
    let payload = req.body.payload;

    // form-data হলে payload string আসে → JSON.parse প্রয়োজন
    if (typeof payload === 'string') {
        payload = JSON.parse(payload);
    }

    // image থাকলে সেটা যোগ করুন
    if (req.file) {
        payload.thumbnailURL = req.file.path;
    }

    const result = await AdminServices.createCourseInDB(payload);
    sendResponse(res, result);
});


const updateCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.updateCourseInDB(req.params.id, req.body);
    sendResponse(res, result);
});

const deleteCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.deleteCourseInDB(req.params.id);
    sendResponse(res, result);
});

const getCourses = catchAsync(async (req, res) => {
    const result = await AdminServices.getCoursesFromDBAdmin(req.query);
    sendResponse(res, result);
});

const getCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.getCourseByIdFromDB(req.params.id);
    sendResponse(res, result);
});

// Batches
const createBatch = catchAsync(async (req, res) => {
    const result = await AdminServices.createBatchInDB(req.body);
    sendResponse(res, result);
});

const getAllBatches = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllBatches();
    sendResponse(res, result);
});

const updateBatch = catchAsync(async (req, res) => {
    const result = await AdminServices.updateBatchInDB(req.params.id, req.body);
    sendResponse(res, result);
});

const deleteBatch = catchAsync(async (req, res) => {
    const result = await AdminServices.deleteBatchInDB(req.params.id);
    sendResponse(res, result);
});

const getBatchesForCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.getBatchesForCourse(req.params.courseId);
    sendResponse(res, result);
});
const getBatchById = catchAsync(async (req, res) => {
    const result = await AdminServices.getBatchById(req.params.batchId);
    sendResponse(res, result);
});

// Enrollments
const getEnrollmentsForCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.getEnrollmentsByCourse(req.params.courseId);
    sendResponse(res, result);
});

const getEnrollmentsForBatch = catchAsync(async (req, res) => {
    const result = await AdminServices.getEnrollmentsByBatch(req.params.batchId);
    sendResponse(res, result);
});
const getAllEnrollments = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllEnrollments();
    sendResponse(res, result);
});

// Assignment review
const getAssignmentsForCourse = catchAsync(async (req, res) => {
    const result = await AdminServices.getAssignmentsForCourse(req.params.courseId);
    sendResponse(res, result);
});



export const AdminControllers = {

    getUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser
    ,
    // courses
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourse,
    // batches
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchesForCourse,
    getAllBatches,
    getBatchById,
    // enrollments
    getEnrollmentsForCourse,
    getEnrollmentsForBatch,
    getAllEnrollments,
    // assignments
    getAssignmentsForCourse,

};
