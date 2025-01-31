import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import {
  PatternDetectorStrategy,
  Transaction,
  DetectedPattern,
} from '../interfaces/pattern-detector.strategy';

@Injectable()
export class OpenRouterPatternDetectorStrategy
  extends OpenAIService
  implements PatternDetectorStrategy
{
  async detectPatterns(
    transactions: Transaction[],
  ): Promise<DetectedPattern[]> {
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

    return this.createStructuredCompletion<DetectedPattern[]>(prompt, {
      temperature: 0.3,
      maxTokens: 1000,
    });
  }
}
