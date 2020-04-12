export interface SystemErrorInformation {
    code: number;
    message: string;
    httpStatus?: number;
}

function generateErrorInformation(code: number, message: string, httpStatus ?: number): SystemErrorInformation {
    return {
        code,
        message,
        httpStatus,
    };
}

export class SystemErrorCodes {
    static readonly UnknownError = generateErrorInformation(1000, 'Internal server error occurred. Please contact system administrator.', 500);
    static readonly ResourceUnavailable = generateErrorInformation(1001, 'Resources are unavailable in the pool, please try after some time.', 503);
    static readonly TaskFailure = generateErrorInformation(1002, 'Given task has failed to complete, please verify the configuration.', 500);
}
