import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IncomingMessage} from 'http';
import {RequestContextInjector} from '../providers/request-context-injector.provider';
import {RequestLoggerService} from '../providers/request-logger.provider';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger;

    constructor(private readonly ctx: RequestContextInjector) {
        this.logger = new RequestLoggerService(ctx, LoggingInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        return next
            .handle()
            .pipe(tap(() => this.logRequest(request, now)));
    }

    private logRequest(request: IncomingMessage, start: number): void {
        this.logger.log(`Request[Method=${request.method}, Path=${request.url}, Duration=${Date.now() - start}ms]`);
    }
}
