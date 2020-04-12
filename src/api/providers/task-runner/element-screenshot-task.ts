import {AbstractTaskRunner} from './abstract-task-runner';
import {ElementScreenshotTask, Task} from '../../../interfaces/task-chain';
import {BoundingBox, ElementHandle, Page} from 'puppeteer';
import {TaskHelpers} from '../../../helpers/task-helpers';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';

export class ElementScreenshotTaskRunner extends AbstractTaskRunner {
    protected readonly logger;

    constructor(ctx: RequestContextInjector) {
        super();
        this.logger = new RequestLoggerService(ctx, ElementScreenshotTaskRunner.name);
    }

    async doRun(task: Task, page: Page): Promise<any> {
        const internalTask: ElementScreenshotTask = task as ElementScreenshotTask;
        // Virtually update the viewport to get full page view.
        await page.setViewport({
            width: internalTask.viewport?.width || 1920,
            height: internalTask.viewport?.height || 1080,
        });
        const element: ElementHandle = await TaskHelpers.getElement(page, internalTask);
        const boundingBox: BoundingBox = await element.boundingBox();
        const padding = internalTask.padding || 0;
        const originalViewPort = page.viewport();
        const screenshotBase64 = await element.screenshot({
            type: 'png',
            encoding: 'base64',
            clip: {
                x: boundingBox.x - padding,
                y: boundingBox.y - padding,
                width: boundingBox.width + padding * 2,
                height: boundingBox.height + padding * 2,
            },
        });
        await page.setViewport(originalViewPort);
        return screenshotBase64;
    }

    fetchLogs() {
        return this.logger.getLogs();
    }

}
