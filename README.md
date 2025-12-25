# 🎓 Course Management | Backend API
🌐 Live API URL: https://course-management-dashboard-eight.vercel.app
🖥 Client (Frontend): https://course-management-landing-page.vercel.app
📦 Server Repository: https://github.com/Debos602/course-management-server
 (example)
## 📘 Introduction

The Course Management Backend API is a scalable and secure server-side application designed to power a complete course management platform.
It provides robust APIs for managing courses, lessons, quizzes, batches, enrollments, and users with proper authentication and authorization.

This backend serves both:

Public Landing Page (course listing & details)

Admin / Instructor Dashboard (course & content management)

## 🧩 Project Description

The Course Management system enables administrators and instructors to create and manage educational content, while students can browse courses, enroll, and access learning materials.

The API is built with a clean architecture, role-based access control, and optimized database queries to ensure performance, security, and maintainability.

## 🛠 Technology Used

Programming Language: TypeScript

Runtime: Node.js

Framework: Express.js

Database: MongoDB

ODM: Mongoose

Validation Library: Zod

Authentication: JSON Web Tokens (JWT)

Password Hashing: bcrypt

File Upload: Cloudinary

Email Service: Nodemailer

## 🚀 Features
###🔐 Authentication & Authorization

Secure user registration & login

JWT-based access & refresh token system

Role-based access control (Admin, Instructor, Student)

Password reset & email verification support

##📚 Course Management

Create, update, delete, and publish courses

Course categorization & tagging

Course pricing (Free / Paid)

Course thumbnail & media upload

## 🧠 Lesson & Quiz Management

CRUD operations for lessons

Quiz creation with questions & answers

Marks, duration, and explanations support

Quiz publish/unpublish control

##👥 Batch & Enrollment System

Batch creation and assignment

Student enrollment management

Course-to-batch relationship handling

## 📊 Dashboard Support

Optimized APIs for admin dashboard

Pagination, filtering, and sorting

Lazy-loading friendly endpoints

## 🧪 Developer Experience

Centralized error handling

Input validation with Zod

Clean modular folder structure

RESTful API design

## 📂 Folder Structure (Simplified)
src/
├─ app/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ user/
│  │  ├─ course/
│  │  ├─ lesson/
│  │  ├─ quiz/
│  │  ├─ batch/
│  │  └─ enrollment/
│  ├─ middlewares/
│  ├─ routes/
│  ├─ utils/
│  └─ config/
├─ server.ts
└─ app.ts

## ⚙️ Setup Instruction

Follow the steps below to run the server locally.

1️⃣ Clone the Repository
git clone https://github.com/Debos602/course-management-server.git

2️⃣ Change Directory
cd course-management-server

3️⃣ Install Dependencies
Using Yarn
yarn install

Using npm
npm install --legacy-peer-deps

4️⃣ Configure Environment Variables

Create a .env file in the root directory and add the following:

NODE_ENV=development
PORT=5000
DB_URI=mongodb://localhost:27017/course-management

BASE_URL=http://localhost:5000
CLIENT_BASE_URL=http://localhost:5173

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXP_IN=7d
JWT_REFRESH_EXP_IN=365d

MAIL_AUTH_USER=your_email
MAIL_AUTH_PASS=your_email_password

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

5️⃣ Run the Server
Using Yarn
yarn dev

Using npm
npm run dev

6️⃣ Server Running At
http://localhost:5000

## 🔮 Future Improvements

Certificate generation

Progress tracking & analytics

Payment gateway integration

Notification system

GraphQL support
