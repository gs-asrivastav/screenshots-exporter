import {Module} from '@nestjs/common';
import {AppController} from './api/controllers/app.controller';
import {AppService} from './app.service';
import {PuppeteerIntegration} from './helpers/puppeteer-integration';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {PuppeteerModule} from './helpers/puppeteer.module';
import {LoggingInterceptor} from './api/interceptors/request-logging.interceptor';
import {RequestContextInjector} from './api/providers/request-context-injector.provider';

@Module({
    imports: [
        PuppeteerModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
    ],
    controllers: [AppController],
    providers: [AppService, RequestContextInjector, PuppeteerIntegration, LoggingInterceptor],
})
export class AppModule {
}
