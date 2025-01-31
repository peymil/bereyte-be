import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NormalizedTransaction,
  NormalizedTransactionDocument,
} from './schemas/normalized-transaction.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transaction-upload/schemas/transaction.schema';
import { NormalizedTransactionResponse } from './dtos/analyze-transaction.dto';
import { Gpt35TransactionNormalizerStrategy } from './strategies/gpt35-transaction-normalizer.strategy';
import { TransactionNormalizer as TransactionNormalizerInterface } from './transaction-normalizer.interface';

@Injectable()
export class TransactionNormalizerService {
  constructor(
    private readonly gpt35TransactionNormalizerStrategy: Gpt35TransactionNormalizerStrategy,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(NormalizedTransaction.name)
    private normalizedTransactionModel: Model<NormalizedTransactionDocument>,
  ) {}

  selectStrategy(strategy: string): TransactionNormalizerInterface {
    if (strategy === 'gpt3.5') {
      return this.gpt35TransactionNormalizerStrategy;
    } else {
      throw new BadRequestException('Invalid strategy');
    }
  }

  async getNormalizedTransactions(): Promise<NormalizedTransactionResponse[]> {
    const normalizedTransactions = await this.normalizedTransactionModel
      .find()
      .sort({ transactionDate: -1 })
      .lean();

    return normalizedTransactions.map((transaction) => ({
      normalized: {
        merchant: transaction.merchant,
        category: transaction.category,
        subCategory: transaction.subCategory,
        confidence: transaction.confidence,
        isSubscription: transaction.isSubscription,
        flags: transaction.flags,
      },
      amount: transaction.amount,
      date: transaction.transactionDate,
      _id: (transaction._id as Types.ObjectId).toHexString(),
    }));
  }

  async analyzeTransactions(): Promise<NormalizedTransactionResponse[]> {
    const normalizedTransactionIds =
      await this.normalizedTransactionModel.distinct('transactionId');

    // shitty fix but added for now for UX.
    const transactions = await this.transactionModel.find({
      _id: { $nin: normalizedTransactionIds },
    });

    if (transactions.length === 0) {
      throw new BadRequestException(
        'No transactions found to analyze. Upload a file first',
      );
    }

    const results: NormalizedTransactionResponse[] = [];
    const strategy = this.selectStrategy('gpt3.5');
    for (const transaction of transactions) {
      const normalized = await strategy.normalize({
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
      });

      const savedTransaction = await this.normalizedTransactionModel.create({
        transactionId: transaction._id,
        merchant: normalized.merchant,
        category: normalized.category,
        subCategory: normalized.subCategory,
        confidence: normalized.confidence,
        isSubscription: normalized.isSubscription,
        flags: normalized.flags,
        transactionDate: transaction.date,
        amount: transaction.amount,
      });

      results.push({
        normalized: {
          merchant: normalized.merchant,
          category: normalized.category,
          subCategory: normalized.subCategory,
          confidence: normalized.confidence,
          isSubscription: normalized.isSubscription,
          flags: normalized.flags,
        },
        amount: transaction.amount,
        date: transaction.date,
        _id: (savedTransaction._id as Types.ObjectId).toHexString(),
      });
    }

    return results;
  }

  async deleteAllNormalizedTransactions(): Promise<void> {
    await this.normalizedTransactionModel.deleteMany({});
  }
}
