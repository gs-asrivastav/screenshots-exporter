import {ArgumentsHost, Catch, ExceptionFilter, Injectable} from '@nestjs/common';
import {SystemError} from '../../error/system-error';
import {SystemErrorCodes} from '../../interfaces/error-codes';
import {IncomingMessage, ServerResponse} from 'http';

@Injectable()
@Catch(Error)
export class GlobalExceptionHandler implements ExceptionFilter {

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        return this.handleInternalError(exception, request, response);
    }

    handleInternalError(exception: Error, request: any, response: any) {
        let internal: SystemError;
        if (exception instanceof SystemError) {
            internal = exception as SystemError;
        } else {
            internal = new SystemError(SystemErrorCodes.UnknownError, null);
        }
        return response.status(internal.httpStatus).json({
            errorCode: `API_${internal.code}`,
            errorMessage: internal.userErrorMessage,
            data: internal.result,
            duration: Date.now() - request._internal_context.start,
        });
    }
}
