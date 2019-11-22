import {Inject, Injectable, Logger} from '@nestjs/common';
import {Cluster} from 'puppeteer-cluster';
import {EvaluateFn, Page} from 'puppeteer';
import {Readable} from 'stream';

@Injectable()
export class PuppeteerIntegration {
    private readonly logger = new Logger(PuppeteerIntegration.name);

    constructor(@Inject('PUPPETEER_CLUSTER')
                private readonly cluster: Cluster) {
        // Constructor
        process.setMaxListeners(Infinity);
    }

    async screenshot(url: string, config: any): Promise<Buffer> {
        return await this.cluster.execute(async ({page, data, worker}) => {
            await page.setViewport({height: 1080, width: 1920});
            return this.wrapper(this.getFileName(), page, config, 5);
        });
    }

    async pdf(url: string, config: any): Promise<Buffer> {
        return await this.cluster.execute(async ({page, data, worker}) => {
            await page.setViewport({height: 1080, width: 1920});
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
        const listenFor = PuppeteerIntegration.getListenForCallback(page);
        await page.exposeFunction('onCustomEvent', e => {
            // tslint:disable-next-line:no-console
            console.log(`${e.type} fired`, e.detail || '');
        });

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
            result = await page.screenshot({
                type: 'png',
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                },
            });
        }
        await page.close();
        return result;
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
