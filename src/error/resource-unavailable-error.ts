import {SystemError} from './system-error';
import {SystemErrorCodes} from '../interfaces/error-codes';

export class ResourceUnavailableError extends SystemError {
    constructor(data?: any, ...args) {
        super(SystemErrorCodes.ResourceUnavailable, data, ...args);
    }
}
