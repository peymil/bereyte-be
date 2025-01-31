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
import { OpenRouterPatternDetectorStrategy } from './strategies/openrouter-pattern-detector.strategy';

@Module({
  imports: [
    AIModule,
    MongooseModule.forFeature([
      { name: TransactionPattern.name, schema: TransactionPatternSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PatternAnalyzerController],
  providers: [PatternAnalyzerService, OpenRouterPatternDetectorStrategy],
  exports: [PatternAnalyzerService],
})
export class PatternAnalyzerModule {}
