import {AbstractTaskRunner} from './abstract-task-runner';
import {SleepTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class SleepTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, SleepTaskRunner.name);
    }

    async doRun(task: Task, page: Page): Promise<any> {
        const internalTask: SleepTask = task as SleepTask;
        await page.waitFor(internalTask.sleep);
    }

    fetchLogs() {
        return this.logger.getLogs();
    }
}
