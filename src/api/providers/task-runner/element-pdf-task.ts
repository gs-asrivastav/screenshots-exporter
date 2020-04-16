import {AbstractTaskRunner} from './abstract-task-runner';
import {ElementScreenshotTask, Task} from '../../../interfaces/task-chain';
import {BoundingBox, ElementHandle, Page, PDFOptions} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';
import {TaskHelpers} from '../../../helpers/task-helpers';

export class ElementPDFTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, ElementPDFTaskRunner.name);
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

    async doRun(task: Task, page: Page): Promise<any> {
        const internalTask: ElementScreenshotTask = task as ElementScreenshotTask;
        await page.setViewport({
            width: internalTask.viewport?.width || 1920,
            height: internalTask.viewport?.height || 1080,
        });
        const element: ElementHandle = await TaskHelpers.getElement(page, internalTask);
        const boundingBox: BoundingBox = await element.boundingBox();
        const padding = internalTask.padding || 0;
        const originalViewPort = page.viewport();
        const pdfOpts: PDFOptions = {
            preferCSSPageSize: true,
            width: boundingBox.width + padding,
            height: boundingBox.height + padding,
        };
        const buffer: Buffer = await page.pdf(pdfOpts);
        await page.setViewport(originalViewPort);
        return Promise.resolve(buffer.toString('base64'));
    }

}
