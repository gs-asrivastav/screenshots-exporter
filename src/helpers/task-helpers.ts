import {ConsoleMessage, ElementHandle, Page} from 'puppeteer';
import {TaskWithSelector} from '../interfaces/task-chain';

export class TaskHelpers {
    static async getElement(page: Page, internalTask: TaskWithSelector): Promise<ElementHandle> {
        let element: ElementHandle;
        if (internalTask.useXPath) {
            element = await page.waitForXPath(internalTask.selector, {visible: true});
        } else {
            element = await page.waitForSelector(internalTask.selector, {visible: true});
        }
        if (element === null || element === undefined) {
            throw new Error(`Failed to find element[Selector = ${internalTask.selector}]`);
        }
        return element;
    }

    static convertConsoleMessages(messages: ConsoleMessage[]) {
        return messages.map((message: ConsoleMessage) => {
            return {
                type: message.type(),
                text: message.text(),
                location: {
                    url: message.location().url,
                    line: message.location().lineNumber,
                    column: message.location().columnNumber,
                },
            };
        });
    }
}
