import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenRouterTransactionNormalizerStrategy } from './strategies/openrouter-transaction-normalizer.strategy';
import {
  NormalizedTransaction,
  NormalizedTransactionDocument,
} from '../transfer-normalizer/schemas/normalized-transaction.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transaction-upload/schemas/transaction.schema';
import { NormalizedTransactionResponse } from './dtos/analyze-transaction.dto';

@Injectable()
export class TransferNormalizerService {
  constructor(
    private readonly normalizerStrategy: OpenRouterTransactionNormalizerStrategy,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(NormalizedTransaction.name)
    private normalizedTransactionModel: Model<NormalizedTransactionDocument>,
  ) {}

  async analyzeTransactions(
    sessionId: string,
  ): Promise<NormalizedTransactionResponse[]> {
    // Shitty fix I know.
    const transactions = await this.transactionModel.find({
      sessionId,
      _id: {
        $nin: await this.normalizedTransactionModel
          .find({ sessionId })
          .distinct('transactionId'),
      },
    });

    if (transactions.length === 0) {
      throw new BadRequestException(
        'No transactions found for session. Upload a file first',
      );
    }

    const results: NormalizedTransactionResponse[] = [];
    for (const transaction of transactions) {
      const normalized = await this.normalizerStrategy.normalize({
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date.toISOString(),
      });

      await this.normalizedTransactionModel.create({
        transactionId: transaction._id,
        merchant: normalized.merchant,
        category: normalized.category,
        subCategory: normalized.subCategory,
        confidence: normalized.confidence,
        isSubscription: normalized.isSubscription,
        flags: normalized.flags,
        transactionDate: transaction.date,
        amount: transaction.amount,
        sessionId,
      });

      results.push({
        normalized: {
          merchant: normalized.merchant,
          category: normalized.category,
          sub_category: normalized.subCategory,
          confidence: normalized.confidence,
          is_subscription: normalized.isSubscription,
          flags: normalized.flags,
        },
      });
    }

    return results;
  }
}
