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
exports.run = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../app/config"));
const student_model_1 = require("../app/modules/student/student.model");
const ADMIN_EMAIL = config_1.default.admin_email || 'debos.das.02@gmail.com';
const ADMIN_PASSWORD = config_1.default.admin_password || 'password123!';
const ADMIN_NAME = config_1.default.admin_name || 'Debos Das';
const ADMIN_PHONE = config_1.default.admin_phone || '01834491602';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUri = config_1.default.db_uri;
        if (!dbUri) {
            console.error('DB_URI not configured in environment');
            process.exit(1);
        }
        try {
            yield mongoose_1.default.connect(dbUri);
            const existing = yield student_model_1.User.findOne({ email: ADMIN_EMAIL }).lean();
            if (existing) {
                console.log('Admin already exists');
                yield mongoose_1.default.disconnect();
                return;
            }
            // Let the User model pre-save hook hash the password
            const admin = yield student_model_1.User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin',
                phone: ADMIN_PHONE,
                avatarURL: '',
            });
            if (admin) {
                console.log('Admin created successfully');
            }
            else {
                console.error('Failed to create admin');
            }
            yield mongoose_1.default.disconnect();
        }
        catch (err) {
            console.error('Seeder error:', err.message || err);
            try {
                yield mongoose_1.default.disconnect();
            }
            catch (e) {
                // ignore
            }
            process.exit(1);
        }
    });
}
exports.run = run;
// If executed directly, run the seeder
if (require.main === module) {
    run()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
