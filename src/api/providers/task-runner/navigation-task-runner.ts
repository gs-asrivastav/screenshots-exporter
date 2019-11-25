import {AbstractTaskRunner} from './abstract-task-runner';
import {NavigationTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class NavigationTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, NavigationTaskRunner.name);
    }

    async doRun(task: Task, page: Page): Promise<any> {
        const internalTask: NavigationTask = task as NavigationTask;
        this.logger.verbose(`Starting Navigation Task, navigating to URL = ${internalTask.url}`);
        await page.goto(internalTask.url, {waitUntil: 'domcontentloaded'});
    }

    fetchLogs() {
        return this.logger.getLogs();
    }
}
