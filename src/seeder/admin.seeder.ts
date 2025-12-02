import mongoose from 'mongoose';
import config from '../app/config';
import { User } from '../app/modules/user/user.model';

const ADMIN_EMAIL = (config.admin_email as string) || 'debos.das.02@gmail.com';
const ADMIN_PASSWORD = (config.admin_password as string) || 'password123!';
const ADMIN_NAME = (config.admin_name as string) || 'Debos Das';
const ADMIN_PHONE = (config.admin_phone as string) || '01834491602';

export async function run() {
    const dbUri = config.db_uri as string | undefined;
    if (!dbUri) {
        console.error('DB_URI not configured in environment');
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUri);

        const existing = await User.findOne({ email: ADMIN_EMAIL }).lean();
        if (existing) {
            console.log('Admin already exists');
            await mongoose.disconnect();
            return;
        }

        // Let the User model pre-save hook hash the password
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
            phone: ADMIN_PHONE,
            avatarURL: '',
        });

        if (admin) {
            console.log('Admin created successfully');
        } else {
            console.error('Failed to create admin');
        }

        await mongoose.disconnect();
    } catch (err: any) {
        console.error('Seeder error:', err.message || err);
        try {
            await mongoose.disconnect();
        } catch (e) {
            // ignore
        }
        process.exit(1);
    }
}

// If executed directly, run the seeder
if (require.main === module) {
    run()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
