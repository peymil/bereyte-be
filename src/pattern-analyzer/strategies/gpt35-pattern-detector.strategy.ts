import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../ai/openai.service';
import {
  DetectedPattern,
  PatternDetectorStrategy,
  Transaction,
} from '../pattern-detector.interface';

@Injectable()
export class Gpt35PatternDetectorStrategy implements PatternDetectorStrategy {
  constructor(private readonly openAIService: OpenAIService) {}

  detectPatterns(transactions: Transaction[]): Promise<DetectedPattern[]> {
    const prompt = `
      Analyze these transactions and detect patterns, especially subscriptions and recurring payments.
      Return the analysis in JSON format.

      Transactions:
      ${transactions
        .map(
          (t) => `
        Description: ${t.description}
        Amount: ${t.amount}
        Date: ${t.date}
      `,
        )
        .join('\n')}

      Required fields for each pattern:
      - type: Type of pattern (subscription, recurring, periodic)
      - merchant: Normalized merchant name
      - amount: Expected amount of the transaction
      - frequency: Frequency of occurrence (daily, weekly, monthly, quarterly, yearly)
      - confidence: Number between 0 and 1 indicating confidence in the pattern
      - nextExpected: Expected date of next occurrence (YYYY-MM-DD format)
    `;

    return this.openAIService.createStructuredCompletion<DetectedPattern[]>(
      prompt,
      {
        temperature: 0.3,
        maxTokens: 1000,
      },
    );
  }
}
