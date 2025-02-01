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
      You are a financial pattern detection system. Analyze the provided transactions to identify recurring patterns and subscriptions.
      Focus on detecting regular payment patterns while considering variations in dates and amounts.

      Pattern Detection Rules:
      1. Subscription Patterns:
         - Look for identical merchant names and similar amounts
         - Common subscription services (e.g., Netflix, Spotify, Apple)
         - Regular intervals between payments
      
      2. Recurring Patterns:
         - Similar merchant names (may have slight variations)
         - Amount can vary within 15% of the average
         - Regular but not necessarily exact intervals

      Frequency Determination Rules:
      - Daily: Transactions occur every 1-2 days
      - Weekly: Transactions occur every 5-9 days
      - Monthly: Transactions occur every 28-32 days
      - Quarterly: Transactions occur every 85-95 days
      - Yearly: Transactions occur every 360-370 days

      Confidence Score Calculation:
      - Start with base confidence of 1.0
      - Subtract 0.1 for each missing expected transaction
      - Subtract 0.1 for each significant amount variation (>5%)
      - Subtract 0.1 for each significant date variation (>2 days from expected)
      - Subtract 0.2 if merchant names have variations
      - Minimum confidence is 0.3

      Next Expected Date Calculation:
      1. For subscriptions:
         - Use the most recent transaction date
         - Add the exact interval based on detected frequency
      2. For recurring payments:
         - Calculate the average interval between past transactions
         - Add this interval to the most recent transaction date

      Return a JSON object with an array of detected patterns. Each pattern must include:
      - type: "subscription" or "recurring"
      - merchant: Normalized merchant name (remove special characters, standardize spacing)
      - amount: Expected amount (average for recurring, exact for subscriptions)
      - frequency: One of: daily, weekly, monthly, quarterly, yearly
      - confidence: Number between 0 and 1 based on confidence calculation rules
      - next_expected: YYYY-MM-DD format based on next expected date calculation rules

      Example pattern:
      {
        "type": "subscription",
        "merchant": "Netflix",
        "amount": 19.99,
        "frequency": "monthly",
        "confidence": 0.9,
        "next_expected": "2024-02-15"
      }

      <transactions>
      ${JSON.stringify(transactions, null, 2)}
      </transactions>

    `;

    return this.openAIService.createStructuredCompletion<AnalyzePatternsResponse>(
      prompt,
      {
        temperature: 0.3,
        maxTokens: 4096,
      },
    );
  }
}
