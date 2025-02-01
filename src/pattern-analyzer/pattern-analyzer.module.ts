import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIModule } from '../ai/ai.module';
import { PatternAnalyzerController } from './pattern-analyzer.controller';
import { PatternAnalyzerService } from './pattern-analyzer.service';
import {
  TransactionPattern,
  TransactionPatternSchema,
} from './schemas/transaction-pattern.schema';
import {
  Transaction,
  TransactionSchema,
} from '../transaction-upload/schemas/transaction.schema';
import { Gpt4MiniPatternDetectorStrategy } from './strategies/gpt4-mini-pattern-detector.strategy';

@Module({
  imports: [
    AIModule,
    MongooseModule.forFeature([
      { name: TransactionPattern.name, schema: TransactionPatternSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PatternAnalyzerController],
  providers: [PatternAnalyzerService, Gpt4MiniPatternDetectorStrategy],
  exports: [PatternAnalyzerService],
})
export class PatternAnalyzerModule {}
