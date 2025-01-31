import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionNormalizerController } from './transaction-normalizer.controller';
import { TransactionNormalizerService } from './transaction-normalizer.service';
import {
  NormalizedTransaction,
  NormalizedTransactionSchema,
} from './schemas/normalized-transaction.schema';
import { AIModule } from '../ai/ai.module';
import {
  Transaction,
  TransactionSchema,
} from '../transaction-upload/schemas/transaction.schema';
import { Gpt35TransactionNormalizerStrategy } from './strategies/gpt35-transaction-normalizer.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: NormalizedTransaction.name, schema: NormalizedTransactionSchema },
    ]),
    AIModule,
  ],
  controllers: [TransactionNormalizerController],
  providers: [TransactionNormalizerService, Gpt35TransactionNormalizerStrategy],
})
export class TransactionNormalizerModule {}
