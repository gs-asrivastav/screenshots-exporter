import {forwardRef, Global, Inject, Injectable, Logger} from '@nestjs/common';
import {Cluster} from 'puppeteer-cluster';
import {ConsoleMessage, ConsoleMessageLocation, ConsoleMessageType, EvaluateFn, Page, ScreenshotOptions} from 'puppeteer';
import {Readable} from 'stream';
import {RequestContextInjector} from '../api/providers/request-context-injector.provider';
import {RequestLoggerService} from '../api/providers/request-logger.provider';
import {ApplicationConstants} from './application-constants';

@Global()
export class PuppeteerIntegration {
    private readonly logger = new Logger(PuppeteerIntegration.name);

    constructor(@Inject('PUPPETEER_CLUSTER') private readonly cluster: Cluster,
                @Inject(forwardRef(() => RequestContextInjector)) private readonly ctx: RequestContextInjector) {
        // Constructor
        process.setMaxListeners(Infinity);
        this.logger = new RequestLoggerService(ctx, PuppeteerIntegration.name);
    }

    async screenshot(url: string, config: any): Promise<Buffer> {
        return await this.cluster.execute(async ({page, data, worker}) => {
            await page.setViewport(ApplicationConstants.DEFAULT_VIEWPORT_OPTIONS);
            return this.wrapper(this.getFileName(), page, config, 5);
        });
    }

    async pdf(url: string, config: any): Promise<Buffer> {
        return await this.cluster.execute(async ({page, data, worker}) => {
            await page.setViewport(ApplicationConstants.DEFAULT_VIEWPORT_OPTIONS);
            this.logger.log(`Width=${page.viewport().width}, Height=${page.viewport().height}`)
            return this.wrapper(this.getFileName(), page, config, 5, true);
        });
    }

    public static async getReadableStream(bufferPromise: Promise<Buffer>): Promise<Readable> {
        const buffer = await bufferPromise;
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    private async wrapper(url: string, page: Page, config: any, padding: number = 2, isPdf = false): Promise<Buffer> {
        const consoleMessages: ConsoleMessage[] = [];
        const listenFor = PuppeteerIntegration.getListenForCallback(page);

        await page.on('console', async msg => {
            return consoleMessages.push(msg);
        });

        const thatLogger = this.logger;
        await page.on('response', async responseEvent => {
            thatLogger.log(`URL: ${responseEvent.url()}, Status: ${responseEvent.status()}`);
        });
        this.logger.log(`Opening URL = ${url}`);
        await page.goto(url);
        // Wait for all network calls to finish.
        // await page.waitForNavigation({waitUntil: 'networkidle0'});
        await listenFor('container-ready');
        await page.evaluate(PuppeteerIntegration.renderHighChart(), config);
        await listenFor('chart-render-ready');

        const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
        }, '#container');
        let result;
        if (isPdf) {
            result = await page.pdf();
        } else {
            const screenshotConfig: ScreenshotOptions = {
                type: 'png',
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                },
            };
            this.logger.log(`Positioning = ` + JSON.stringify(screenshotConfig));
            result = await page.screenshot(screenshotConfig);
        }
        await page.close();
        this.logConsoleMessages(consoleMessages);
        return result;
    }

    logConsoleMessages(logs: ConsoleMessage[]) {
        const mappedLogs = (logs || []).map(log => {
            return {
                location: log.location(),
                text: log.text(),
                type: log.type(),
            };
        });
        this.logger.debug(`Console Messages:\n${JSON.stringify(mappedLogs)}`);
    }

    getFileName() {
        return `file://${process.env.PWD}/client/chart.html`;
    }

    static getListenForCallback(page: Page) {
        return function listenFor(type) {
            return page.evaluateHandle(eventType => {
                document.addEventListener(eventType, e => {
                    // @ts-ignore
                    window.onCustomEvent({eventType, detail: e.detail});
                });

            }, type);
        };
    }

    static renderHighChart(): EvaluateFn<any> {
        return (config) => {
            // @ts-ignore
            window.renderHighChart(config);
        };
    }
}
