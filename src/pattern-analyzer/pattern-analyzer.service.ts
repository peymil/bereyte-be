import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenRouterPatternDetectorStrategy } from './strategies/openrouter-pattern-detector.strategy';
import {
  TransactionPattern,
  TransactionPatternDocument,
} from './schemas/transaction-pattern.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transaction-upload/schemas/transaction.schema';

@Injectable()
export class PatternAnalyzerService {
  constructor(
    private readonly patternDetectorStrategy: OpenRouterPatternDetectorStrategy,
    @InjectModel(TransactionPattern.name)
    private transactionPatternModel: Model<TransactionPatternDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async analyzePatterns(sessionId: string) {
    const transactions = await this.transactionModel
      .find({ sessionId })
      .sort({ date: 1 }) // asc
      .exec();

    if (transactions.length === 0) {
      throw new BadRequestException(
        'No transactions found for session. Upload a file first.',
      );
    }

    const transactionsForAnalysis = transactions.map((t) => ({
      description: t.description,
      amount: t.amount,
      date: t.date.toISOString().split('T')[0],
    }));

    const detectedPatterns = await this.patternDetectorStrategy.detectPatterns(
      transactionsForAnalysis,
    );

    await Promise.all(
      detectedPatterns.map(async (pattern) => {
        const existingPattern = await this.transactionPatternModel.findOne({
          sessionId,
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
            sessionId,
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
}
