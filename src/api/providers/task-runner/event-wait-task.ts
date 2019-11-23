import {AbstractTaskRunner} from './abstract-task-runner';
import {EventWaitTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class EventWaitTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, EventWaitTaskRunner.name);
    }

    async doRun(task: Task, page: Page) {
        const internalTask: EventWaitTask = task as EventWaitTask;
        const listenEvent = EventWaitTaskRunner.getListenForCallback(page);
        await listenEvent(internalTask.event);
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

    static getListenForCallback(page: Page) {
        return function listenFor(type) {
            return page.evaluateHandle(eventType => {
                // tslint:disable-next-line:no-console
                console.info(`Adding Event Listener for ${eventType}`);
                document.addEventListener(eventType, e => {
                    // @ts-ignore
                    window.onCustomEvent({eventType, detail: e.detail});
                    // tslint:disable-next-line:no-console
                    console.info(`Successfully Added Event Listener for ${eventType}`);
                });
            }, type);
        };
    }
}
