import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as MongoStoreFactory from 'connect-mongodb-session';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Configure CORS
  const corsSites = configService.getOrThrow<string>('CORS_SITES');

  const corsOrigins = corsSites
    .split(',')
    .map((site: string) => site.trim())
    .filter((site: string) => site.length > 0);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const MongoDbStore = MongoStoreFactory(session);
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      name: 'access-token',
      store: new MongoDbStore({
        uri: configService.getOrThrow('MONGODB_URI'),
        collection: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Transaction Analysis API')
    .setDescription('API for analyzing and normalizing transaction data')
    .setVersion('1.0')
    .addTag('transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
