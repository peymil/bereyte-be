import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIModule } from '../ai/ai.module';
import { TransferNormalizerController } from './transfer-normalizer.controller';
import { TransferNormalizerService } from './transfer-normalizer.service';
import {
  Transaction,
  TransactionSchema,
} from '../transaction-upload/schemas/transaction.schema';
import {
  NormalizedTransaction,
  NormalizedTransactionSchema,
} from './schemas/normalized-transaction.schema';
import { OpenRouterTransactionNormalizerStrategy } from './strategies/openrouter-transaction-normalizer.strategy';

@Module({
  imports: [
    AIModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: NormalizedTransaction.name, schema: NormalizedTransactionSchema },
    ]),
  ],
  controllers: [TransferNormalizerController],
  providers: [
    TransferNormalizerService,
    OpenRouterTransactionNormalizerStrategy,
  ],
  exports: [TransferNormalizerService],
})
export class TransferNormalizerModule {}
