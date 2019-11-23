import {AbstractTaskRunner} from './abstract-task-runner';
import {PDFTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class PDFTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, PDFTaskRunner.name);
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

    async doRun(task: Task, page: Page): Promise<any> {
        const internalTask: PDFTask = task as PDFTask;
        const buffer: Buffer = await page.pdf(internalTask.options);
        return Promise.resolve(buffer.toString('base64'));
    }

}
