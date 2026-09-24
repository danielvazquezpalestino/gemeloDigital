declare class CustomError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
    static badRequest(message: string): CustomError;
    static unauthorized(message: string): CustomError;
    static forbidden(message: string): CustomError;
    static notFound(message: string): CustomError;
    static internalServer(message?: string): CustomError;
}
export = CustomError;
//# sourceMappingURL=custom.error.d.ts.map