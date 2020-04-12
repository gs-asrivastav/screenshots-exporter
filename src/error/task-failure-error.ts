import {SystemErrorCodes} from '../interfaces/error-codes';
import {SystemError} from './system-error';

export class TaskFailureError extends SystemError {
    constructor(data?: any, ...args) {
        super(SystemErrorCodes.TaskFailure, data, ...args);
    }
}
