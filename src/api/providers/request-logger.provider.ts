import {Injectable, Logger, Scope} from '@nestjs/common';
import {RequestContextInjector} from './request-context-injector.provider';

@Injectable({
    scope: Scope.TRANSIENT,
})
export class RequestLoggerService extends Logger {

    private readonly requestCtx: RequestContextInjector;
    private readonly moduleName: string;
    constructor(requestCtx: RequestContextInjector, context?: string, isTimestampEnabled?: boolean) {
        super(context, isTimestampEnabled);
        this.requestCtx = requestCtx;
        this.moduleName = context;
    }

    log(message: string, context?: string) {
        super.log(message, this.getPrefix(context));
    }

    debug(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
    }

    error(message: any, trace?: string, context?: string): any {
        super.debug(message, this.getPrefix(context));
    }

    verbose(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
    }

    warn(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
    }

    private getPrefix(context?: string): string {
        const moduleMessage = !!this.moduleName ? `${this.moduleName}` : '';
        const contextMessage = !!context ? ` ${context}` : '';
        return `${moduleMessage} rId:${this.requestCtx.requestId}${contextMessage}`;
    }
}
