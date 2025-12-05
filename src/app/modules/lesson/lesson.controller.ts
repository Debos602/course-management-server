import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LessonServices } from './lesson.service';


const getLesson = catchAsync(async (req, res) => {
    const result = await LessonServices.getLessonById(req.params.id);
    sendResponse(res, result as any);
});

const getByCourse = catchAsync(async (req, res) => {

    const result = await LessonServices.getLessonsByCourse(
        req.params.courseId,
    );
    sendResponse(res, result);
});


const createLesson = catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    // Support clients sending a JSON string in `body` (common for multipart requests)
    let payload: any = { ...(req.body || {}) };
    if (typeof payload.body === 'string') {
        try {
            const parsed = JSON.parse(payload.body);
            payload = { ...payload, ...parsed };
        } catch (e) {
            // ignore parse errors
        }
    }

    // attach uploaded video url if present (multer-storage-cloudinary sets `path` or `secure_url`)
    const file = req.file as any | undefined;
    if (file) {
        payload.videoURL = file.path || file.secure_url || file.url || '';
    }

    console.log('Creating course lesson with payload:', payload);

    const result = await LessonServices.createLessonForCourse(courseId, payload);
    sendResponse(res, result as any);
});

export const LessonControllers = {
    getLesson,
    getByCourse,
    createLesson,
};
