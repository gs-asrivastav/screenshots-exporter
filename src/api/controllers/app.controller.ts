import {Body, Controller, Post, Res, UseInterceptors} from '@nestjs/common';
import {AppService} from '../providers/app.service';
import {PuppeteerIntegration} from '../../helpers/puppeteer-integration';
import {LoggingInterceptor} from '../interceptors/request-logging.interceptor';
import {TaskChain} from '../../interfaces/task-chain';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly puppeteerIntegration: PuppeteerIntegration) {
    }

    @Post('/tasks/run')
    async runTask(@Body() requestBody: TaskChain) {
        return await this.appService.runTask(requestBody);
    }

    @Post('/highcharts/screenshot')
    async createScreenshot(@Body() requestBody: any, @Res() response) {
        const readableStream = await PuppeteerIntegration.getReadableStream(this.puppeteerIntegration
            .screenshot('/chart.html', requestBody));
        readableStream.pipe(response);
    }

    @Post('/pdf')
    async createPDF(@Body() requestBody: any, @Res() response) {
        const readableStream = await PuppeteerIntegration.getReadableStream(this.puppeteerIntegration
            .pdf('/chart.html', requestBody));
        readableStream.pipe(response);
    }

}
