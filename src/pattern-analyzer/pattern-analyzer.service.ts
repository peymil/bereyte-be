import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TransactionPattern,
  TransactionPatternDocument,
} from './schemas/transaction-pattern.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transaction-upload/schemas/transaction.schema';
import { Gpt35PatternDetectorStrategy } from './strategies/gpt35-pattern-detector.strategy';

@Injectable()
export class PatternAnalyzerService {
  constructor(
    private readonly gpt35PatternDetectorStrategy: Gpt35PatternDetectorStrategy,
    @InjectModel(TransactionPattern.name)
    private transactionPatternModel: Model<TransactionPatternDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  selectPatternAnalyzerStrategy(strategy: string) {
    if (strategy === 'gpt3.5') {
      return this.gpt35PatternDetectorStrategy;
    } else {
      throw new BadRequestException('Invalid strategy');
    }
  }

  async analyzePatterns() {
    const transactions = await this.transactionModel
      .find()
      .sort({ date: 1 }) // asc
      .exec();

    if (transactions.length === 0) {
      throw new BadRequestException(
        'No transactions found. Upload a file first.',
      );
    }

    const transactionsForAnalysis = transactions.map((t) => ({
      description: t.description,
      amount: t.amount,
      date: t.date.toISOString().split('T')[0],
    }));

    const strategy = this.selectPatternAnalyzerStrategy('gpt3.5');

    const detectedPatterns = await strategy.detectPatterns(
      transactionsForAnalysis,
    );

    await Promise.all(
      detectedPatterns.map(async (pattern) => {
        const existingPattern = await this.transactionPatternModel.findOne({
          merchant: pattern.merchant,
          amount: Math.abs(pattern.amount),
          type: pattern.type,
        });

        if (!existingPattern) {
          const newPattern = new this.transactionPatternModel({
            type: pattern.type,
            merchant: pattern.merchant,
            amount: Math.abs(pattern.amount),
            frequency: pattern.frequency,
            confidence: pattern.confidence,
            nextExpected: new Date(pattern.nextExpected),
            lastOccurrence: new Date(
              transactions[transactions.length - 1].date,
            ),
            occurrenceCount: 1,
            isActive: true,
          });
          await newPattern.save();
        }
      }),
    );

    return {
      patterns: detectedPatterns.map((pattern) => ({
        type: pattern.type,
        merchant: pattern.merchant,
        amount: pattern.amount,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        next_expected: pattern.nextExpected,
      })),
    };
  }

  async deleteAllPatterns(): Promise<void> {
    await this.transactionPatternModel.deleteMany({});
  }
}
