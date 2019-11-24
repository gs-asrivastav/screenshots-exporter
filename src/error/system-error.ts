import {SystemErrorCodes, SystemErrorInformation} from '../interfaces/error-codes';

export class SystemError extends Error {
    // tslint:disable-next-line:variable-name
    private readonly _result: any;
    private readonly internalCode: SystemErrorInformation;

    // tslint:disable-next-line:ban-types
    constructor(code: SystemErrorInformation, result?: any, ...args) {
        super(...args);
        this._result = result || null;
        this.internalCode = code || SystemErrorCodes.UnknownError;
        Error.captureStackTrace(this, SystemError);
    }

    get code() {
        return this.internalCode.code;
    }

    get userErrorMessage() {
        return this.internalCode.message;
    }

    get httpStatus() {
        return this.internalCode.httpStatus;
    }

    get result() {
        return this._result;
    }
}
