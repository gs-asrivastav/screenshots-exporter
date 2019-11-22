import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PuppeteerIntegration} from './helpers/puppeteer-integration';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {PuppeteerModule} from './helpers/puppeteer.module';

@Module({
    imports: [
        PuppeteerModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
    ],
    controllers: [AppController],
    providers: [AppService, PuppeteerIntegration],
})
export class AppModule {
}
