import { IUser } from '../modules/student/student.interface';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}
