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
exports.AssignmentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const assignment_service_1 = require("./assignment.service");
const submit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const student = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
    const payload = Object.assign(Object.assign({}, (req.body || {})), { student });
    // If no title provided by the client, generate a harmless default to satisfy schema validation.
    if (!payload.title || String(payload.title).trim() === '') {
        payload.title = `Submission by ${student} - ${new Date().toISOString()}`;
    }
    const result = yield assignment_service_1.AssignmentServices.submitAssignment(payload);
    (0, sendResponse_1.default)(res, result);
}));
const myAssignments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const student = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString();
    const result = yield assignment_service_1.AssignmentServices.getAssignmentsForStudent(student);
    (0, sendResponse_1.default)(res, result);
}));
exports.AssignmentControllers = { submit, myAssignments };
