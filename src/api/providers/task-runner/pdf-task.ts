import {AbstractTaskRunner} from './abstract-task-runner';
import {PDFTask, Task} from '../../../interfaces/task-chain';
import {Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';
import {TaskFailureError} from '../../../error';

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
        let options = internalTask.options;
        if (internalTask.evaluateFromWindow) {
            if (!!internalTask.variableMap && !!internalTask.variableMap.height && !!internalTask.variableMap.width) {
                const dimensions: any = await page.evaluate<any>((variableMap) => {
                    return {
                        height: window[variableMap.height],
                        width: window[variableMap.width],
                    };
                }, internalTask.variableMap);
                if (!!dimensions.height && !!dimensions.width) {
                    options = {
                        ...options,
                        height: `${dimensions.height + internalTask.padding || 0} px`,
                        width: `${dimensions.width + internalTask.padding || 0} px`,
                    };
                } else {
                    throw new TaskFailureError('Failed to validate the PDF Task, valid results were not returned from the window.');
                }
            } else {
                throw new TaskFailureError('Failed to validate the PDF Task, ' +
                    'you have chosen to evaluate from window but the variable map is missing');
            }
        }
        const buffer: Buffer = await page.pdf(options);
        return Promise.resolve(buffer.toString('base64'));
    }

}
