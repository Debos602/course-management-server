import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { AdminServices } from '../admin/admin.service';

const getCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getCourses(req.query);
    sendResponse(res, result as any);
});

const getCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.getCourseById(req.params.id);
    sendResponse(res, result as any);
});

const enroll = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const result = await CourseServices.enrollInCourse(userId, req.params.id);
    sendResponse(res, result as any);
});

const getEnrolled = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const result = await CourseServices.getEnrolledCourses(userId as string);
    sendResponse(res, result as any);
});

const getLesson = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, lessonId } = req.params as any;
    const result = await CourseServices.getLessonForUser(userId, courseId, lessonId);
    sendResponse(res, result as any);
});

const markComplete = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, lessonId } = req.params as any;
    const result = await CourseServices.markLessonComplete(userId, courseId, lessonId);
    sendResponse(res, result as any);
});

const submitAssignment = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const courseId = req.params.id as string;
    const payload = req.body;
    const result = await CourseServices.submitAssignment(userId, courseId, payload);
    sendResponse(res, result as any);
});

const submitQuiz = catchAsync(async (req, res) => {
    const userId = req.user?._id?.toString();
    const { id: courseId, quizId } = req.params as any;
    const answers = req.body.answers as number[];
    const result = await CourseServices.submitQuiz(userId, courseId, quizId, answers);
    sendResponse(res, result as any);
});

export const CourseControllers = {
    getCourses,
    getCourse,
    enroll,
    getEnrolled,
    getLesson,
    markComplete,
    submitAssignment,
    submitQuiz,
    // admin actions
    createCourse: catchAsync(async (req, res) => {
        console.log('Creating course with data:', req.body, 'file:', req.file, 'files:', (req as any).files);
        // Start with form fields. Some clients (mobile apps) send a single field 'body' containing
        // a JSON string with the actual payload. Handle that case by parsing it.
        let payload: any = { ...(req.body || {}) };
        if (typeof payload.body === 'string') {
            try {
                const parsed = JSON.parse(payload.body);
                // merge parsed JSON into payload (parsed fields take precedence)
                payload = { ...payload, ...parsed };
            } catch (e) {
                // invalid JSON — leave as-is and the validation will surface the issue
            }
        }

        // Determine uploaded file (support req.file, req.files array, or req.files object from fields)
        let file: any = undefined;
        if (req.file) file = req.file;
        else if ((req as any).files) {
            const files = (req as any).files;
            if (Array.isArray(files) && files.length > 0) file = files[0];
            else if (typeof files === 'object') {
                // fields format: { thumbnail: [file], other: [file] }
                const keys = Object.keys(files);
                if (keys.length > 0 && Array.isArray(files[keys[0]]) && files[keys[0]].length > 0) {
                    file = files[keys[0]][0];
                }
            }
        }

        // Attach thumbnail URL from multer/cloudinary upload (varies by storage)
        if (file) {
            payload.thumbnailURL = file.path || file.secure_url || file.url || '';
        }

        // Normalise common JSON-string fields sent inside multipart forms
        // (tags, syllabus may be sent as JSON strings)
        if (typeof payload.tags === 'string') {
            try {
                payload.tags = JSON.parse(payload.tags);
            } catch (e) {
                // if not JSON, attempt to split by comma
                payload.tags = payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            }
        }
        if (typeof payload.syllabus === 'string') {
            try {
                payload.syllabus = JSON.parse(payload.syllabus);
            } catch (e) {
                payload.syllabus = payload.syllabus.split(',').map((s: string) => s.trim()).filter(Boolean);
            }
        }

        // If the client included a nested 'body' key, remove it after parsing
        if (Object.prototype.hasOwnProperty.call(payload, 'body')) delete payload.body;

        const result = await AdminServices.createCourseInDB(payload);
        sendResponse(res, result as any);
    }),
    updateCourse: catchAsync(async (req, res) => {
        const result = await AdminServices.updateCourseInDB(req.params.id, req.body);
        sendResponse(res, result as any);
    }),
    deleteCourse: catchAsync(async (req, res) => {
        const result = await AdminServices.deleteCourseInDB(req.params.id);
        sendResponse(res, result as any);
    }),
};
