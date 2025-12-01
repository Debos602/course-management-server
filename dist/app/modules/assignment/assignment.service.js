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
exports.AssignmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const assignment_model_1 = require("./assignment.model");
exports.AssignmentServices = {
    submitAssignment: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const assignment = yield assignment_model_1.Assignment.create({
            title: payload.title,
            submissionLink: payload.submissionLink,
            textAnswer: payload.textAnswer,
            course: payload.course,
            lesson: payload.lesson,
            student: payload.student,
            submittedAt: new Date(),
        });
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Assignment submitted',
            data: assignment,
        };
    }),
    getAssignmentsForStudent: (studentId) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield assignment_model_1.Assignment.find({ student: studentId }).select('-__v');
        return { statusCode: http_status_1.default.OK, message: 'Assignments fetched', data: items };
    }),
};
