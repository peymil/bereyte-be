import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../ai/openai.service';
import { TransactionNormalizer } from '../transaction-normalizer.interface';
import { NormalizedTransaction } from '../schemas/normalized-transaction.schema';
import { Transaction } from 'src/transaction-upload/schemas/transaction.schema';

@Injectable()
export class Gpt35TransactionNormalizerStrategy
  implements TransactionNormalizer
{
  constructor(private readonly openAIService: OpenAIService) {}

  async normalize(
    transactions: Transaction[],
  ): Promise<NormalizedTransaction[]> {
    const prompt = `Analyze these transactions and provide a JSON array response with the following structure for each transaction:
[
  {
    "merchant": "normalized/cleaned merchant name",
    "category": "main category (e.g., Food & Dining, Shopping, Bills & Utilities)",
    "subCategory": "specific category (e.g., Restaurants, Groceries, Online Shopping)",
    "confidence": "confidence score between 0-1",
    "isSubscription": "boolean indicating if this is a subscription payment",
    "flags": ["array of relevant flags like recurring, high-value, international"]
  }
]

Transaction details:
${transactions
  .map(
    (t) => `
Description: ${t.description}
Amount: ${t.amount}
Date: ${t.date.toISOString().split('T')[0]}
---`,
  )
  .join('\n')}`;

    return await this.openAIService.analyzeTransaction<NormalizedTransaction[]>(
      prompt,
      {
        temperature: 0.3,
        maxTokens: 500,
      },
    );
  }
}
