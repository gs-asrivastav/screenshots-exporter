import {AbstractTaskRunner} from './abstract-task-runner';
import {EventWaitTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

/**
 * https://github.com/puppeteer/puppeteer/blob/master/examples/custom-event.js
 */
export class EventWaitTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, EventWaitTaskRunner.name);
    }

    async doRun(task: Task, page: Page) {
        const internalTask: EventWaitTask = task as EventWaitTask;

        const fnAwaitName = `_listener_${internalTask.event.replace(/[^a-z0-9]/gi, '')}`;
        await this.testDoRun(task, page);
    }

    async testDoRun(task: Task, page: Page): Promise<any> {
        const internalTask: EventWaitTask = task as EventWaitTask;
        const fnAwaitName = `_listener_${internalTask.event.replace(/[^a-z0-9]/gi, '')}`;
        return new Promise(async (resolve, reject) => {
            await page.exposeFunction(fnAwaitName, e => {
                this.logger.log(`${internalTask.event} was fired, resolving promise.`);
                resolve();
            });

            await page.evaluate((eventType, callbackName) => {
                // tslint:disable-next-line:no-console
                console.info(`Adding Event Listener for ${eventType}`);
                window.addEventListener(eventType, e => {
                    // @ts-ignore
                    window[callbackName](eventType);
                    // tslint:disable-next-line:no-console
                    console.info(`Successfully Added Event Listener for ${eventType}`);
                });
            }, internalTask.event, fnAwaitName);
        });
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

    static getListenForCallback(page: Page) {
        return async function listenFor(type, fnAwaitName) {
            return await page.evaluate(eventType => {
                // tslint:disable-next-line:no-console
                console.info(`Adding Event Listener for ${eventType}`);
                window.addEventListener(eventType, e => {
                    // @ts-ignore
                    window[fnAwaitName](eventType);
                    // tslint:disable-next-line:no-console
                    console.info(`Successfully Added Event Listener for ${eventType}`);
                });
            }, type, fnAwaitName);
        };
    }
}
