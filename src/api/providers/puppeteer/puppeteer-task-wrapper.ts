import {forwardRef, Global, Inject} from '@nestjs/common';
import {Pool} from 'generic-pool';
import {Browser, BrowserContext, Page} from 'puppeteer';
import {RequestContextInjector} from '../request-context-injector.provider';
import {RequestLoggerService} from '../request-logger.provider';
import {ResourceUnavailableError} from '../../../error';

@Global()
export class PuppeteerTaskWrapper {
    private readonly logger;

    constructor(@Inject('PUPPETEER_POOL') private readonly puppeteerPool: Pool<Browser>,
                @Inject(forwardRef(() => RequestContextInjector)) private readonly ctx: RequestContextInjector) {
        this.logger = new RequestLoggerService(ctx, PuppeteerTaskWrapper.name);
    }

    private async before(): Promise<Browser> {
        return this.puppeteerPool.acquire();
    }

    async run(cb: (page: Page) => Promise<any>): Promise<any> {
        let browser: Browser;
        try {
            browser = await this.before();
            this.logger.log(`Assigned Browser PID: ${browser.process().pid}`);
        } catch (e) {
            throw new ResourceUnavailableError('Resources unavailable, please scale the system.');
        }

        let incognito: BrowserContext;
        let incognitoPage: Page;
        try {
            incognito = await browser.createIncognitoBrowserContext();
            incognitoPage = await incognito.newPage();
            return await cb.apply(undefined, [incognitoPage]);
        } catch (e) {
            this.logger.error(`Failed to get incognito context. [Error = ${e.message}] [Stack = ${e.stack}]`);
            throw e;
        } finally {
            if (incognitoPage) {
                await incognitoPage.close();
            }
            if (incognito) {
                await incognito.close();

            }
            await this.puppeteerPool.release(browser);
        }
    }
}
