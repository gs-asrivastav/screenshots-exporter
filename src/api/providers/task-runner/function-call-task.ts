import {AbstractTaskRunner} from './abstract-task-runner';
import {FunctionCallTask, Task} from '../../../interfaces/task-chain';
import {EvaluateFn, Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class FunctionCallTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, FunctionCallTaskRunner.name);
    }

    async doRun(task: Task, page: Page) {
        const internalTask: FunctionCallTask = task as FunctionCallTask;
        return await page.evaluate(FunctionCallTaskRunner.runFn(), internalTask.name, internalTask.arguments);
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

    static runFn(): EvaluateFn<any> {
        return (functionName: string, fnArguments: any[]) => {
            // @ts-ignore
            // tslint:disable-next-line:no-console
            console.info(`Running Function: ${functionName}`);
            if (window.hasOwnProperty(functionName) && typeof window[functionName] === 'function') {
                return window[functionName](...fnArguments);
            } else {
                throw new Error(`Failed to find function ${functionName}`);
            }
        };
    }
}
