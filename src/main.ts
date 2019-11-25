import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {GlobalExceptionHandler} from './api/filters/global-exception-handler';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.enableShutdownHooks()
        .useGlobalFilters(new GlobalExceptionHandler())
        .listen(process.env.port || 3000);
}

bootstrap();
