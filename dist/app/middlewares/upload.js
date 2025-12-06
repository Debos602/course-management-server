"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
});
// Default storage for images/files
exports.upload = (0, multer_1.default)({ storage: storage });
// Separate storage configuration for video uploads (Cloudinary resource_type: 'video')
const videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    // multer-storage-cloudinary's Params typing is narrow; cast to any to allow resource_type
    params: {
        resource_type: 'video',
        folder: 'videos',
    },
});
exports.uploadVideo = (0, multer_1.default)({ storage: videoStorage });
