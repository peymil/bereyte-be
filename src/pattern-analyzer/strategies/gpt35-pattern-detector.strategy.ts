import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../ai/openai.service';
import { PatternDetectorStrategy } from '../pattern-detector.interface';
import { AnalyzePatternsResponse } from '../dtos/analyze-patterns.dto';
import { Transaction } from '../../transaction-upload/schemas/transaction.schema';

@Injectable()
export class Gpt35PatternDetectorStrategy implements PatternDetectorStrategy {
  constructor(private readonly openAIService: OpenAIService) {}

  detectPatterns(
    transactions: Transaction[],
  ): Promise<AnalyzePatternsResponse> {
    const prompt = `
      Analyze these transactions within the <transactions> tag and detect patterns, especially subscriptions and recurring payments.
      Return the analysis in JSON format.

      <transactions>
      ${transactions
        .map(
          (t) => `
        Description: ${t.description}
        Amount: ${t.amount}
        Date: ${t.date.toISOString()}
      `,
        )
        .join('\n')}
      </transactions>
      
      
      Required fields for each pattern:
      - type: Type of pattern (subscription, recurring)
      - merchant: Normalized merchant name
      - amount: Expected amount of the transaction
      - frequency: Frequency of occurrence (daily, weekly, monthly, quarterly, yearly)
      - confidence: Number between 0 and 1 indicating confidence in the pattern
      - next_expected: Expected date of next occurrence (YYYY-MM-DD format)
    `;

    return this.openAIService.createStructuredCompletion<AnalyzePatternsResponse>(
      prompt,
      {
        temperature: 0.3,
        maxTokens: 1000,
      },
    );
  }
}
