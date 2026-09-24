"use strict";
class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CustomError';
    }
    static badRequest(message) {
        return new CustomError(message, 400);
    }
    static unauthorized(message) {
        return new CustomError(message, 401);
    }
    static forbidden(message) {
        return new CustomError(message, 403);
    }
    static notFound(message) {
        return new CustomError(message, 404);
    }
    static internalServer(message = 'Internal Server Error') {
        return new CustomError(message, 500);
    }
}
module.exports = CustomError;
//# sourceMappingURL=custom.error.js.map