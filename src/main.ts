import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as MongoDBStore from 'connect-mongodb-session';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const MongoStore = MongoDBStore(session);

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || 'my-secret',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        uri: configService.get('MONGODB_URI'),
        collection: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Transaction Analysis API')
    .setDescription('API for analyzing and normalizing transaction data')
    .setVersion('1.0')
    .addTag('transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
