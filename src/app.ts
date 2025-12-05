import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app = express();

// Ensure client URL exists
const clientUrl = config.client_base_url || "http://localhost:5173";

const corsOptions = {
    origin: [clientUrl],
    credentials: true,
};

// CORS must be FIRST
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// parsers
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1', router);

// test route
app.get('/', (_req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: 'Course management server is running successfully!',
    });
});

// globalError handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
