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
    const prompt = `You are a transaction normalizer that analyzes financial transactions and provides structured, normalized data. For each transaction, analyze the description and provide normalized information according to the following rules:

1. Merchant Name Normalization:
   - Remove unnecessary prefixes/suffixes (e.g., "TST*", "MKTP", store numbers)
   - Standardize common variations (e.g., "NFLX DIGITAL NTFLX" → "Netflix")
   - Use official brand names when possible

2. Category and Sub-category:
   - Assign a broad category (e.g., Entertainment, Shopping, Transportation)
   - Provide a specific sub-category (e.g., Streaming Service, Online Retail, Ride Sharing)
   - Be consistent with categorization across similar merchants

3. Subscription Detection:
   - Mark as subscription if:
     * Regular recurring payments (streaming services, memberships)
     * Digital services with standard pricing
     * Known subscription providers (Netflix, Spotify, etc.)

4. Confidence Score (0-1):
   - 0.95-1.00: Clear merchant name, well-known brand
   - 0.85-0.94: Recognizable but with some variations
   - 0.70-0.84: Requires some interpretation
   - Below 0.70: Significant uncertainty

5. Transaction Flags:
   - subscription: Regular recurring payments
   - digital_service: Online/digital purchases
   - transportation: Travel/transit related
   - food_delivery: Restaurant delivery services
   - retail: Physical store purchases
   - gas: Fuel/gas station purchases
   - marketplace: Online marketplace purchases
   - Etc.

Here are some examples of the expected output format:

Input: "NFLX DIGITAL NTFLX US"
{
  "merchant": "Netflix",
  "category": "Entertainment",
  "sub_category": "Streaming Service",
  "confidence": 0.98,
  "is_subscription": true,
  "flags": ["subscription", "digital_service"]
}

Input: "UBER   *TRIP HELP.UBER.CO"
{
  "merchant": "Uber",
  "category": "Transportation",
  "sub_category": "Ride Sharing",
  "confidence": 0.96,
  "is_subscription": false,
  "flags": ["transportation", "service"]
}

Analyze the following transactions and provide normalized data in the same format:
${JSON.stringify(transactions, null, 2)}
`;

    const normalizedResults =
      await this.openAIService.createStructuredCompletion<
        NormalizedTransaction[]
      >(prompt, {
        temperature: 0.3,
        maxTokens: 500,
      });

    return normalizedResults.map((result, index) => ({
      ...result,
      original: transactions[index].description,
    }));
  }
}
