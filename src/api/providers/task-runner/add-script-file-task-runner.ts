import {AbstractTaskRunner} from './abstract-task-runner';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';
import {Page} from 'puppeteer';
import {Task} from '../../../interfaces/task-chain';

export class AddScriptFileTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, AddScriptFileTaskRunner.name);
    }

    async doRun(task: Task, page: Page): Promise<any> {
        for (const arg of task.arguments) {
            this.logger.log(`Mounting script tag from path ${arg}`);
            await page.addScriptTag({
                path: arg,
            });
        }
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

}
