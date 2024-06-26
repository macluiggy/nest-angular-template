// test.utils.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';
import { SuccesResponseInterceptor } from '../src/common/interceptors/succes-request-response.interceptor';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../src/db/config/entities';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { typeOrmConfig } from '../src/db/config/typeorm.config';

export default async function setupTestingModule({
  imports = [],
  exports = [],
  controllers = [],
  providers = [],
}: ModuleMetadata = {}) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      TypeOrmModule.forRoot({
        ...typeOrmConfig,
      }),
      TypeOrmModule.forFeature(entities),
      ...imports,
    ],
    exports,
    controllers,
    providers,
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccesResponseInterceptor());
  await app.init();

  return { app, testingModule: moduleFixture };
}
