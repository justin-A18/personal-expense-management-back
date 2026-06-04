import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './config/filters/http-excepton.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://personal-expense-management-six.vercel.app'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Personal Expense Management API')
    .setDescription(
      'API para gestionar usuarios, autenticación, billeteras, transacciones y reportes financieros personales.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT obtenido desde el endpoint de login.',
      },
      'access-token',
    )
    .addServer('/api/v1', 'API v1')
    .addTag('Auth', 'Registro, login, validación de email y recuperación.')
    .addTag('Wallets', 'Billeteras del usuario autenticado.')
    .addTag('Transactions', 'Movimientos financieros y balance persistido.')
    .addTag('Reports', 'Reportes semanales y mensuales por billetera.')
    .addTag('Users', 'Endpoints legacy de usuarios.')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, swaggerDocument, {
    customSiteTitle: 'Personal Expense Management API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(port);
}

bootstrap();
