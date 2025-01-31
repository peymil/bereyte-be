import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import {
  TransactionNormalizerStrategy,
  TransactionNormalizerInput,
  NormalizedTransactionOutput,
} from '../interfaces/transaction-normalizer.strategy';

@Injectable()
export class OpenRouterTransactionNormalizerStrategy
  extends OpenAIService
  implements TransactionNormalizerStrategy
{
  async normalize(
    transaction: TransactionNormalizerInput,
  ): Promise<NormalizedTransactionOutput> {
    const prompt = `
      Analyze this transaction and provide normalized merchant information in JSON format:
      Transaction Description: ${transaction.description}
      Amount: ${transaction.amount}
      Date: ${transaction.date}

      Required fields:
      - merchant: Normalized merchant name
      - category: Main category of the transaction
      - subCategory: More specific category
      - confidence: Number between 0 and 1 indicating confidence in the analysis
      - isSubscription: Boolean indicating if this appears to be a subscription
      - flags: Array of relevant tags (e.g., "online_purchase", "marketplace", "recurring")
    `;

    return this.createStructuredCompletion<NormalizedTransactionOutput>(prompt, {
      temperature: 0.3,
      maxTokens: 300,
    });
  }
}