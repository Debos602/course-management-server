import httpStatus from 'http-status';
import { Course } from './course.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { Lesson } from '../lesson/lesson.model';
import { Assignment } from '../assignment/assignment.model';
import { Quiz } from '../quiz/quiz.model';
import { QuizAttempt } from '../quiz/quizAttempt.model';
import AppError from '../../errors/AppError';

type Query = {
    page?: string | number;
    limit?: string | number;
    search?: string;
    sort?: string;
    category?: string;
    tags?: string;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const CourseServices = {
    getCourses: async (query: Query) => {
        const page = Number(query.page) || DEFAULT_PAGE;
        const limit = Number(query.limit) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const filter: any = { isPublished: true };

        if (query.search) {
            // text search
            filter.$text = { $search: query.search };
        }

        if (query.category) {
            filter.category = query.category;
        }

        if (query.tags) {
            const tags = (query.tags as string).split(',').map((t) => t.trim());
            filter.tags = { $in: tags };
        }

        let sort: any = { createdAt: -1 };
        if (query.sort) {
            if (query.sort === 'price_asc') sort = { price: 1 };
            if (query.sort === 'price_desc') sort = { price: -1 };
        }

        const [total, items] = await Promise.all([
            Course.countDocuments(filter),
            Course.find(filter).sort(sort).skip(skip).limit(limit).select('-__v'),
        ]);

        return {
            statusCode: httpStatus.OK,
            message: 'Courses fetched successfully',
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    },

    getCourseById: async (id: string) => {
        const course = await Course.findById(id).populate({ path: 'syllabus', select: 'title videoURL order' }).select('-__v');

        if (!course) {
            throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
        }

        return {
            statusCode: httpStatus.OK,
            message: 'Course fetched successfully',
            data: course,
        };
    },

    enrollInCourse: async (userId: string | undefined, courseId: string) => {
        if (!userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You must be logged in to enroll');
        }

        // ensure course exists
        const course = await Course.findById(courseId);
        if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');

        // create enrollment (unique enforced)
        try {
            const enrollment = await Enrollment.create({ user: userId, course: courseId });

            return {
                statusCode: httpStatus.CREATED,
                message: 'Enrolled successfully',
                data: enrollment,
            };
        } catch (err: any) {
            // duplicate key means already enrolled
            if (err.code === 11000) {
                throw new AppError(httpStatus.BAD_REQUEST, 'User already enrolled');
            }
            throw err;
        }
    },

    getEnrolledCourses: async (userId: string) => {
        const enrollments = await Enrollment.find({ user: userId }).populate({ path: 'course', select: '-__v' });

        const data = enrollments.map((e) => ({
            enrollmentId: e._id,
            course: e.course,
            progress: e.progress ?? 0,
            status: e.status,
        }));

        return {
            statusCode: httpStatus.OK,
            message: 'Enrolled courses fetched',
            data,
        };
    },

    getLessonForUser: async (userId: string | undefined, courseId: string, lessonId: string) => {
        if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) throw new AppError(httpStatus.FORBIDDEN, 'You are not enrolled in this course');

        const lesson = await Lesson.findById(lessonId).select('-__v');
        if (!lesson) throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');

        return {
            statusCode: httpStatus.OK,
            message: 'Lesson fetched',
            data: lesson,
        };
    },

    markLessonComplete: async (userId: string | undefined, courseId: string, lessonId: string) => {
        if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) throw new AppError(httpStatus.FORBIDDEN, 'You are not enrolled in this course');

        const already = (enrollment.completedLessons || []).some((l: any) => l.toString() === lessonId);
        if (!already) {
            enrollment.completedLessons = [...(enrollment.completedLessons || []), lessonId as any];

            // compute progress based on course syllabus length
            const course = await Course.findById(courseId).select('syllabus');
            const total = (course?.syllabus?.length) || 0;
            const completed = enrollment.completedLessons.length;
            enrollment.progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            if (enrollment.progress >= 100) enrollment.status = 'completed';
            await enrollment.save();
        }

        return {
            statusCode: httpStatus.OK,
            message: 'Lesson marked complete',
            data: { progress: enrollment.progress, completedLessons: enrollment.completedLessons },
        };
    },

    submitAssignment: async (userId: string | undefined, courseId: string, payload: { title: string; submissionLink?: string; textAnswer?: string; lessonId?: string; }) => {
        if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) throw new AppError(httpStatus.FORBIDDEN, 'You are not enrolled in this course');

        const assignment = await Assignment.create({
            title: payload.title,
            description: payload.title,
            submissionLink: payload.submissionLink,
            textAnswer: payload.textAnswer,
            course: courseId,
            lesson: payload.lessonId,
            student: userId,
            submittedAt: new Date(),
        });

        return {
            statusCode: httpStatus.CREATED,
            message: 'Assignment submitted',
            data: assignment,
        };
    },

    submitQuiz: async (userId: string | undefined, courseId: string, quizId: string, answers: number[]) => {
        if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) throw new AppError(httpStatus.FORBIDDEN, 'You are not enrolled in this course');

        const quiz = await Quiz.findById(quizId);
        if (!quiz) throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');

        let score = 0;
        const questions = quiz.questions || [];
        for (let i = 0;i < questions.length;i++) {
            const q = questions[i] as any;
            if (typeof q.correctAnswerIndex === 'number' && answers[i] === q.correctAnswerIndex) {
                score += q.marks || 1;
            }
        }

        const attempt = await QuizAttempt.create({ quiz: quizId, user: userId, answers, score, submittedAt: new Date() });

        return {
            statusCode: httpStatus.OK,
            message: 'Quiz submitted',
            data: { attemptId: attempt._id, score, total: questions.reduce((s: number, q: any) => s + (q.marks || 1), 0) },
        };
    },
};
