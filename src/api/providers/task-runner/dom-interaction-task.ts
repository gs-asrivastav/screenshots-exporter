import {AbstractTaskRunner} from './abstract-task-runner';
import {DomInteractionTask, Task} from '../../../interfaces/task-chain';
import {ElementHandle, Page} from 'puppeteer';
import {TaskHelpers} from '../../../helpers/task-helpers';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class DomInteractionTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, DomInteractionTaskRunner.name);
    }

    async doRun(task: Task, page: Page) {
        const internalTask: DomInteractionTask = task as DomInteractionTask;
        const element: ElementHandle = await TaskHelpers.getElement(page, internalTask);
        const functionCall = element[internalTask.interaction.toString()];
        if (functionCall !== undefined && typeof functionCall === 'function') {
            await functionCall.apply(element, internalTask.arguments);
        } else {
            throw new Error(`Invalid DOM interaction selected: ${internalTask.interaction}`);
        }
    }

    fetchLogs() {
        return this.logger.getLogs();
    }
}
