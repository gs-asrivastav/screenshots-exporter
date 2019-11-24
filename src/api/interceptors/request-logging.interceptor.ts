import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ServerResponse} from 'http';
import {RequestContextInjector} from '../providers/request-context-injector.provider';
import {RequestLoggerService} from '../providers/request-logger.provider';
import {Request} from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger;

    constructor(private readonly ctx: RequestContextInjector) {
        this.logger = new RequestLoggerService(ctx, LoggingInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request: Request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next
            .handle()
            .pipe(tap(() => this.logRequest(request, response, now)));
    }

    private logRequest(request: any, response: ServerResponse, start: number): void {
        this.logger.log(`Request[Status=${response?.statusCode}, Method=${request.method}, Path=${request.url}, Duration=${Date.now() - start}ms]`);
    }
}
