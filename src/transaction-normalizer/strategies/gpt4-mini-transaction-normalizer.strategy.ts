import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../ai/openai.service';
import { TransactionNormalizer } from '../transaction-normalizer.interface';
import { NormalizedTransaction } from '../schemas/normalized-transaction.schema';
import { Transaction } from 'src/transaction-upload/schemas/transaction.schema';

@Injectable()
export class Gpt4MiniTransactionNormalizerStrategy
  implements TransactionNormalizer
{
  constructor(private readonly openAIService: OpenAIService) {}

  async normalize(
    transactions: Transaction[],
  ): Promise<NormalizedTransaction[]> {
    const prompt = `
  You are a financial transaction normalization system. Your task is to analyze transaction descriptions and return ONLY a JSON array containing normalized information for each transaction. Each normalized transaction must strictly follow this format:    
      {
        "merchant": "Normalized merchant name without special characters",
        "category": "One of: Entertainment, Shopping, Transportation, Food, Utilities, Services",
        "sub_category": "More specific category (e.g., Streaming Service, Online Retail, Ride Sharing)",
        "confidence": "Number between 0 and 1",
        "is_subscription": "Boolean true/false",
        "flags": ["Array of relevant flags"]
      }
      
      Available flags:
      - subscription: Regular recurring payments
      - digital_service: Online/digital purchases
      - transportation: Travel/transit related
      - food_delivery: Restaurant delivery services
      - retail: Physical store purchases
      - gas: Fuel/gas station purchases
      - marketplace: Online marketplace purchases
      
      Merchant Name Normalization Rules:
      1. Remove prefixes like "TST*", "MKTP", store numbers
      2. Standardize common variations (e.g., "NFLX DIGITAL NTFLX" → "Netflix")
      3. Use official brand names when possible
      4. Remove special characters and extra spaces
      
      Confidence Score Rules:
      - 0.95-1.00: Clear merchant name, well-known brand
      - 0.85-0.94: Recognizable but with some variations
      - 0.70-0.84: Requires some interpretation
      - Below 0.70: Significant uncertainty
      
      Subscription Detection Rules:
      Mark is_subscription as true if:
      1. Known subscription services (Netflix, Spotify, Apple, etc.)
      2. Digital services with standard pricing
      3. Regular recurring payments
      
      Example Input:
      [
        {
          "description": "NFLX DIGITAL NTFLX US",
          "amount": 19.99,
          "date": "2024-01-01T00:00:00.000Z"
        }
      ]
      
      Example Output:
      [
        {
          "merchant": "Netflix",
          "category": "Entertainment",
          "sub_category": "Streaming Service",
          "confidence": 0.98,
          "is_subscription": true,
          "flags": ["subscription", "digital_service"]
        }
      ]
      
      IMPORTANT: Your response must be ONLY a valid JSON array containing normalized transactions. Do not include any explanations, markdown formatting, or additional text.
      
      Analyze and normalize these transactions:
      ${JSON.stringify(
        transactions.map((t) => ({
          description: t.description,
          amount: t.amount,
          date: t.date.toISOString(),
        })),
        null,
        2,
      )}`;

    const normalizedResults =
      await this.openAIService.createStructuredCompletion<
        NormalizedTransaction[]
      >(prompt, {
        model: 'openai/gpt-4o-mini',
        temperature: 0.3,
        maxTokens: 4096,
      });

    return normalizedResults.map((result, index) => ({
      ...result,
      original: transactions[index].description,
    }));
  }
}
