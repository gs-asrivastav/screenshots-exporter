import {AbstractTaskRunner} from './abstract-task-runner';
import {Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class ScreenshotTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, ScreenshotTaskRunner.name);
    }

    async doRun(task: Task, page: Page): Promise<any> {
        return await page.screenshot({
            type: 'png',
            encoding: 'base64',
            fullPage: true,
        });
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

}
