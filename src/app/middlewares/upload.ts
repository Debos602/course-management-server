import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});
// Default storage for images/files
export const upload = multer({ storage: storage });

// Separate storage configuration for video uploads (Cloudinary resource_type: 'video')
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    // multer-storage-cloudinary's Params typing is narrow; cast to any to allow resource_type
    params: ({
        resource_type: 'video',
        folder: 'videos',
    } as any),
});

export const uploadVideo = multer({ storage: videoStorage });
