import {createPool, Factory, Options, Pool} from 'generic-pool';
import * as Puppeteer from 'puppeteer';
import {Browser, LaunchOptions} from 'puppeteer';
import {ApplicationConstants} from '../../../helpers/application-constants';

export class GenericPuppeteerPool {
    constructor(private readonly poolOptions ?: Options) {
        process.setMaxListeners(Infinity);
        this.poolOptions = poolOptions || ApplicationConstants.DEFAULT_POOL_OPTS;
    }

    private getFactory(puppeteerArgument: LaunchOptions): Factory<Browser> {
        return {
            create: (): Promise<Browser> => {
                return Puppeteer.launch(puppeteerArgument);
            },
            destroy: (puppeteer: Browser) => {
                return puppeteer.close();
            },
            validate: (puppeteer: Browser) => {
                return Promise.resolve(puppeteer.isConnected());
            },
        };
    }

    getPool(puppeteerArgument: LaunchOptions): Pool<Browser> {
        return createPool(this.getFactory(puppeteerArgument), this.poolOptions);
    }
}
