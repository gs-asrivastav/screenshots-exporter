import {Body, Controller, Post, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {PuppeteerIntegration} from './helpers/puppeteer-integration';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly puppeteerIntegration: PuppeteerIntegration) {
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
