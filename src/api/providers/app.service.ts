import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {RequestContextInjector} from './request-context-injector.provider';
import {RequestLoggerService} from './request-logger.provider';
import {Task, TaskChain, TaskStatus, TaskType} from '../../interfaces/task-chain';
import {ConsoleMessage, Page} from 'puppeteer';
import {ScreenshotTaskRunner} from './task-runner/screenshot-task';
import {PDFTaskRunner} from './task-runner/pdf-task';
import {SetCookiesTaskRunner} from './task-runner/set-cookies-task';
import {FunctionCallTaskRunner} from './task-runner/function-call-task';
import {EventWaitTaskRunner} from './task-runner/event-wait-task';
import {ElementScreenshotTaskRunner} from './task-runner/element-screenshot-task';
import {DomInteractionTaskRunner} from './task-runner/dom-interaction-task';
import {ApplicationConstants} from '../../helpers/application-constants';
import {NavigationTaskRunner} from './task-runner/navigation-task-runner';
import {SleepTaskRunner} from './task-runner/sleep-task-runner';
import {AddScriptFileTaskRunner} from './task-runner/add-script-file-task-runner';
import {AbstractTaskRunner} from './task-runner/abstract-task-runner';
import {TaskHelpers} from '../../helpers/task-helpers';
import {PuppeteerTaskWrapper} from './puppeteer/puppeteer-task-wrapper';
import {TaskFailureError} from '../../error';
import {ElementPDFTaskRunner} from './task-runner/element-pdf-task';

@Injectable()
export class AppService {
    private readonly logger: RequestLoggerService;

    constructor(@Inject(forwardRef(() => PuppeteerTaskWrapper)) private readonly taskWrapper: PuppeteerTaskWrapper,
                @Inject(forwardRef(() => RequestContextInjector)) private readonly ctx: RequestContextInjector) {
        this.logger = new RequestLoggerService(ctx, AppService.name);
    }

    async runTask(taskChain: TaskChain): Promise<any> {
        const consoleMessages: ConsoleMessage[] = [];
        return await this.taskWrapper.run(async (page) => {
            await page.setViewport(ApplicationConstants.DEFAULT_VIEWPORT_OPTIONS);
            this.logger.log(`Width=${page.viewport().width}, Height=${page.viewport().height}`);

            await page.on('console', async msg => {
                return consoleMessages.push(msg);
            });
            const thatLogger = this.logger;
            thatLogger.log(`Opening URL = ${taskChain.url}`);
            await page.goto(taskChain.url, {waitUntil: 'domcontentloaded'});
            const response = await this.runTaskChain(taskChain.tasks, page, this.ctx);
            return {
                results: response,
            };
        });
    }

    private async runTaskChain(tasks: Task[], page: Page, ctx: RequestContextInjector): Promise<any[]> {
        const results = [];
        let taskIndex = 1;
        let success = true;
        for (const task of tasks) {
            const messagesPerTask: ConsoleMessage[] = [];
            const handler = this.getConsoleHandler(messagesPerTask);

            await page.on('console', handler);
            let result;
            const runner = this.runner(task, page, ctx);
            const start = Date.now();

            try {
                result = await this.wrapWithTimeout(task, taskIndex, runner.doRun(task, page));
                success = true;

                results.push({
                    'task-index': taskIndex++,
                    'duration': Date.now() - start,
                    'console-messages': TaskHelpers.convertConsoleMessages(messagesPerTask),
                    'task-logs': runner.fetchLogs(),
                    'status': success ? TaskStatus.SUCCEEDED : TaskStatus.FAILED,
                    result,
                });
            } catch (e) {
                success = false;
                this.logger.error(`Failed to run task ${task.type}. [Error = ${e.message}]\n[Stack = ${e.stack}]`);
                throw new TaskFailureError(results);
            } finally {
                await page.removeListener('console', handler);
                await page.removeAllListeners('request');
            }
        }
        return results;
    }

    private getConsoleHandler(messagesPerTask: ConsoleMessage[]) {
        return msg => {
            return messagesPerTask.push(msg);
        };
    }

    private runner(task: Task, page: Page, ctx: RequestContextInjector): AbstractTaskRunner {
        let runner: AbstractTaskRunner;
        this.logger.log(`Running Task Type: ${task.type}`);
        switch (task.type) {
            case TaskType.NAVIGATION:
                runner = new NavigationTaskRunner(ctx);
                break;
            case TaskType.VIEWPORT_SCREENSHOT:
                runner = new ScreenshotTaskRunner(ctx);
                break;
            case TaskType.VIEWPORT_PDF:
                runner = new PDFTaskRunner(ctx);
                break;
            case TaskType.SET_COOKIES:
                runner = new SetCookiesTaskRunner(ctx);
                break;
            case TaskType.FUNCTION_CALL:
                runner = new FunctionCallTaskRunner(ctx);
                break;
            case TaskType.EVENT_WAIT:
                runner = new EventWaitTaskRunner(ctx);
                break;
            case TaskType.ELEMENT_SCREENSHOT:
                runner = new ElementScreenshotTaskRunner(ctx);
                break;
            case TaskType.DOM_INTERACTION:
                runner = new DomInteractionTaskRunner(ctx);
                break;
            case TaskType.SLEEP:
                runner = new SleepTaskRunner(ctx);
                break;
            case TaskType.ADD_SCRIPT_FILE:
                runner = new AddScriptFileTaskRunner(ctx);
                break;
            case TaskType.ELEMENT_PDF:
                runner = new ElementPDFTaskRunner(ctx);
                break;
            default:
                throw new TaskFailureError(task);
        }
        return runner;
    }

    private async wrapWithTimeout(task: Task, taskId: number, promiseToTimeout: Promise<any>) {
        return Promise.race([
            promiseToTimeout,
            new Promise((_, reject) => setTimeout(() =>
                reject(new Error(`Task ${taskId}: ${task.type} has been timed out.`)), task.timeout || 30000)),
        ]).catch((err: Error) => {
            this.logger.error(`Task ${taskId}: ${task.type} failed. Error =  ${err.message}`);
            throw err;
        });
    }
}
