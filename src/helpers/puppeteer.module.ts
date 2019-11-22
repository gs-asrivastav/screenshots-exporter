import { Module } from '@nestjs/common';
import { puppeteerCluster } from './puppeteer-cluster.provider';

@Module({
    providers: [...puppeteerCluster],
    exports: [...puppeteerCluster],
})
export class PuppeteerModule {

}
