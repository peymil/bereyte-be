import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NormalizedTransaction,
  NormalizedTransactionDocument,
} from './schemas/normalized-transaction.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transaction-upload/schemas/transaction.schema';
import { AnalyzeTransactionResponse } from './dtos/analyze-transaction.dto';
import { Gpt4MiniTransactionNormalizerStrategy } from './strategies/gpt4-mini-transaction-normalizer.strategy';
import { TransactionNormalizer as TransactionNormalizerInterface } from './transaction-normalizer.interface';

@Injectable()
export class TransactionNormalizerService {
  constructor(
    private readonly gpt4MiniTransactionNormalizerStrategy: Gpt4MiniTransactionNormalizerStrategy,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(NormalizedTransaction.name)
    private normalizedTransactionModel: Model<NormalizedTransactionDocument>,
  ) {}

  selectStrategy(strategy: string): TransactionNormalizerInterface {
    if (strategy === 'gpt4-mini') {
      return this.gpt4MiniTransactionNormalizerStrategy;
    } else {
      throw new BadRequestException('Invalid strategy');
    }
  }

  async getNormalizedTransactions(): Promise<AnalyzeTransactionResponse> {
    const normalizedTransactions = await this.normalizedTransactionModel
      .find()
      .populate<{ transactionId: TransactionDocument }>('transactionId')
      .sort({ transactionDate: -1 })
      .lean();

    return {
      normalized_transactions: normalizedTransactions.map(
        (normalizedTransaction) => ({
          original: normalizedTransaction.transactionId.description,
          amount: normalizedTransaction.amount,
          normalized: {
            merchant: normalizedTransaction.merchant,
            category: normalizedTransaction.category,
            sub_category: normalizedTransaction.sub_category,
            confidence: normalizedTransaction.confidence,
            is_subscription: normalizedTransaction.is_subscription,
            flags: normalizedTransaction.flags,
          },
        }),
      ),
    };
  }

  async analyzeTransactions(): Promise<AnalyzeTransactionResponse> {
    const normalizedTransactionIds =
      await this.normalizedTransactionModel.distinct('transactionId');

    const transactions = await this.transactionModel.find({
      _id: { $nin: normalizedTransactionIds },
    });

    if (transactions.length === 0) {
      throw new BadRequestException(
        'No transactions found to analyze. Upload a file first',
      );
    }
    const strategy = this.selectStrategy('gpt4-mini');
    const normalizedResults = await strategy.normalize(transactions);

    const savedTransactions = await Promise.all(
      transactions.map((transaction, index) => {
        const normalized = normalizedResults[index];
        return this.normalizedTransactionModel.create({
          transactionId: transaction._id,
          original: transaction.description,
          merchant: normalized.merchant,
          category: normalized.category,
          sub_category: normalized.sub_category,
          confidence: normalized.confidence,
          is_subscription: normalized.is_subscription,
          flags: normalized.flags,
          transactionDate: transaction.date,
          amount: transaction.amount,
        });
      }),
    );

    return {
      normalized_transactions: savedTransactions.map(
        (savedTransaction, index) => ({
          original: transactions[index].description,
          amount: transactions[index].amount,
          normalized: {
            merchant: normalizedResults[index].merchant,
            category: normalizedResults[index].category,
            sub_category: normalizedResults[index].sub_category,
            confidence: normalizedResults[index].confidence,
            is_subscription: normalizedResults[index].is_subscription,
            flags: normalizedResults[index].flags,
          },
        }),
      ),
    };
  }

  async deleteAllNormalizedTransactions(): Promise<void> {
    await this.normalizedTransactionModel.deleteMany({});
  }
}
