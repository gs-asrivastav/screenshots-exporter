import {Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';

export abstract class AbstractTaskRunner {
    abstract async doRun(task: Task, page: Page);

    abstract fetchLogs();
}
