import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { StandardSchemaValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.enableCsrfProtection({
    trustedOrigins: ["http://localhost:3000"],
    exclude: []
  });
  await app.enableCors ({
    origin: "http://localhost:3000"
  });
  await app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
