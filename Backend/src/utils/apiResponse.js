export class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export const sendResponse = (res, statusCode, data = null, message = "Success") => {
    return res
        .status(statusCode)
        .json(new apiResponse(statusCode, data, message));
};
