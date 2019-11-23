import {Injectable, Logger, Scope} from '@nestjs/common';
import {RequestContextInjector} from './request-context-injector.provider';
import {isObject} from '@nestjs/common/utils/shared.utils';

@Injectable({
    scope: Scope.TRANSIENT,
})
export class RequestLoggerService extends Logger {
    private readonly requestCtx: RequestContextInjector;
    private readonly moduleName: string;
    messages: Array<{ timestamp: number, level: string, message: string }>;

    constructor(requestCtx: RequestContextInjector, context?: string, isTimestampEnabled?: boolean) {
        super(context, isTimestampEnabled);
        this.requestCtx = requestCtx;
        this.moduleName = context;
        this.messages = [];
    }

    log(message: string, context?: string) {
        super.log(message, this.getPrefix(context));
        this.addToLogs(message, 'INFO');
    }

    debug(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
        this.addToLogs(message, 'DEBUG');
    }

    error(message: any, trace?: string, context?: string): any {
        super.debug(message, this.getPrefix(context));
        this.addToLogs(message, 'ERROR');
    }

    verbose(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
        this.addToLogs(message, 'TRACE');
    }

    warn(message: any, context?: string): any {
        super.debug(message, this.getPrefix(context));
        this.addToLogs(message, 'WARN');
    }

    getLogs(): any[] {
        return this.messages;
    }

    private getPrefix(context?: string): string {
        const moduleMessage = !!this.moduleName ? `${this.moduleName}` : '';
        const contextMessage = !!context ? ` ${context}` : '';
        return `${moduleMessage} rId:${this.requestCtx.requestId}${contextMessage}`;
    }

    private addToLogs(message, level) {
        const output = isObject(message)
            ? `Object:\n${JSON.stringify(message, null, 2)}\n`
            : message;
        const epoch = Date.now();
        this.messages.push({
            timestamp: epoch,
            level,
            message: `${output}`,
        });
    }
}
