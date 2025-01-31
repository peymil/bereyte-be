import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validate } from './config/env.config';
import { AIModule } from './ai/ai.module';
import { TransactionNormalizerModule } from './transaction-normalizer/transaction-normalizer.module';
import { TransactionUploadModule } from './transaction-upload/transaction-upload.module';
import { PatternAnalyzerModule } from './pattern-analyzer/pattern-analyzer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AIModule,
    TransactionNormalizerModule,
    TransactionUploadModule,
    PatternAnalyzerModule,
  ],
})
export class AppModule {}
