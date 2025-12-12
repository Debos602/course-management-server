"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enrollment_model_1 = require("./enrollment.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const batch_model_1 = require("../batch/batch.model");
const mongoose_1 = __importDefault(require("mongoose"));
exports.EnrollmentServices = {
    enroll: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find an available batch for the course
            const batch = yield batch_model_1.Batch.aggregate([
                { $match: { course: new mongoose_1.default.Types.ObjectId(courseId) } },
                { $lookup: { from: 'enrollments', localField: '_id', foreignField: 'batch', as: 'enrollments' } },
                { $addFields: { availableSeats: { $subtract: ['$capacity', { $size: '$enrollments' }] } } },
                { $match: { availableSeats: { $gt: 0 } } },
                { $sort: { startDate: 1 } }, // Earliest starting batch first
                { $limit: 1 }
            ]);
            if (!batch || batch.length === 0) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No available batch for this course');
            }
            const selectedBatch = batch[0];
            const enrollment = yield enrollment_model_1.Enrollment.create({
                user: userId,
                course: courseId,
                batch: selectedBatch._id
            });
            // Update the batch to include the enrollment reference
            yield batch_model_1.Batch.findByIdAndUpdate(selectedBatch._id, { $push: { enrollments: enrollment._id } });
            return { statusCode: http_status_1.default.CREATED, message: 'Enrolled', data: enrollment };
        }
        catch (err) {
            if (err.code === 11000)
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Already enrolled');
            throw err;
        }
    }),
    getEnrolledForUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield enrollment_model_1.Enrollment.find({ user: userId }).populate({ path: 'course', select: '-__v' });
        return { statusCode: http_status_1.default.OK, message: 'Enrollments fetched', data: items };
    }),
    updateProgress: (userId, courseId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const enrollment = yield enrollment_model_1.Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Enrollment not found');
        const { progress, completedLesson } = payload || {};
        if (typeof progress === 'number') {
            enrollment.progress = Math.max(0, Math.min(100, progress));
        }
        if (completedLesson) {
            const exists = (_a = enrollment.completedLessons) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === completedLesson.toString());
            if (!exists) {
                enrollment.completedLessons = [...(enrollment.completedLessons || []), completedLesson];
            }
        }
        yield enrollment.save();
        return { statusCode: http_status_1.default.OK, message: 'Progress updated', data: enrollment };
    }),
};
