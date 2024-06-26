import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SuccesResponseInterceptor } from './common/interceptors/succes-request-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import envVariables from './common/envVariables';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CORS_ORIGINS } from './common/constants';
import { IoAdapter } from '@nestjs/platform-socket.io';

const port = envVariables.port;
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: CORS_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalInterceptors(new SuccesResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  // open api
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

bootstrap();
