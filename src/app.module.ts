import {Module} from '@nestjs/common';
import {AppController} from './api/controllers/app.controller';
import {AppService} from './api/providers/app.service';
import {PuppeteerModule} from './api/providers/puppeteer/puppeteer.module';
import {LoggingInterceptor} from './api/interceptors/request-logging.interceptor';
import {RequestContextInjector} from './api/providers/request-context-injector.provider';
import {PuppeteerTaskWrapper} from './api/providers/puppeteer/puppeteer-task-wrapper';

@Module({
    imports: [PuppeteerModule],
    controllers: [AppController],
    providers: [AppService, PuppeteerTaskWrapper, RequestContextInjector, LoggingInterceptor],
})
export class AppModule {
}
