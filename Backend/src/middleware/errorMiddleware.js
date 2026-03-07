import { apiResponse } from './apiResponse.js';

export const errorHandler = (err, req, res, next) => {
    let error = err;
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value: ${field}`;
    }

    const response = new apiResponse(statusCode, null, message);
    res.status(statusCode).json(response);
};
