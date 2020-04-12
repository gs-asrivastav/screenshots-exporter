import {Body, Controller, HttpCode, Post, UseInterceptors} from '@nestjs/common';
import {AppService} from '../providers/app.service';
import {LoggingInterceptor} from '../interceptors/request-logging.interceptor';
import {TaskChain} from '../../interfaces/task-chain';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Post('/tasks/run')
    @HttpCode(200)
    async runTask(@Body() requestBody: TaskChain) {
        return this.appService.runTask(requestBody);
    }

}
