import compression from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { VersioningType } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http.exception';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port = +app.get(AppConfig).port;

  // Add Versioning
  app.enableVersioning({
    defaultVersion: '1',
    prefix: 'api/v',
    type: VersioningType.URI,
  });

  // Add Helmet
  await app.register(helmet, { global: true });

  // Enable Cors
  await app.register(cors, { origin: true });

  // Add Compression
  await app.register(compression, { threshold: 512 });

  // Global Response Interceptor
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  // Error Handler
  app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Creator Platform')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`)
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  // Added for prevent crash server.
  process.on('unhandledRejection', (error) => {
    console.log('UNHANDLED REJECTION...', error);
  });

  await app.listen({ port, host: '0.0.0.0' }, () => {
    console.log(`################################################
  🛡️  Server listening on port: http://0.0.0.0:${port} 🛡️
################################################`);
  });
}

bootstrap().catch((err) => {
  console.error('FAILED TO BOOTSTRAP APPLICATION:', err);
  process.exit(1);
});
