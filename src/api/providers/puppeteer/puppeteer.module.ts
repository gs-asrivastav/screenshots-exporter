import {Module} from '@nestjs/common';
import {puppeteerPool} from './puppeteer-pool-cluster.provider';

@Module({
    providers: [...puppeteerPool],
    exports: [...puppeteerPool],
})
export class PuppeteerModule {

}
