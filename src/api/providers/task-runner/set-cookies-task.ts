import {AbstractTaskRunner} from './abstract-task-runner';
import {SetCookiesTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class SetCookiesTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, SetCookiesTaskRunner.name);
    }

    async doRun(task: Task, page: Page) {
        const internalTask: SetCookiesTask = task as SetCookiesTask;
        if (Array.isArray(internalTask.cookies) && internalTask.cookies.length > 0) {
            await page.setCookie(...internalTask.cookies);
        }
    }

    fetchLogs() {
        return this.logger.getLogs();
    }
}
