import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../config/env.config';
import { OpenAIService } from '../../ai/openai.service';
import { Gpt35TransactionNormalizerStrategy } from './gpt35-transaction-normalizer.strategy';
import { Transaction } from '../../transaction-upload/schemas/transaction.schema';

describe('Gpt35TransactionNormalizerStrategy (Integration)', () => {
  let strategy: Gpt35TransactionNormalizerStrategy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate,
        }),
      ],
      providers: [OpenAIService, Gpt35TransactionNormalizerStrategy],
    }).compile();

    strategy = moduleFixture.get<Gpt35TransactionNormalizerStrategy>(
      Gpt35TransactionNormalizerStrategy,
    );
  });

  it('should normalize a Netflix transaction', async () => {
    const transaction: Transaction = {
      description: 'NFLX DIGITAL NTFLX US',
      amount: 19.99,
      date: new Date('2024-01-01'),
    };

    const result = await strategy.normalize([transaction]);

    expect(result).toHaveLength(1);
    const normalized = result[0];

    expect(normalized.original).toBe(transaction.description);
    expect(normalized.merchant.toLowerCase()).toContain('netflix');
    expect(normalized.category.toLowerCase()).toBe('entertainment');
    expect(normalized.sub_category.toLowerCase()).toContain('stream');
    expect(normalized.confidence).toBeGreaterThan(0.8);
    expect(normalized.is_subscription).toBe(true);
    expect(normalized.flags).toContain('subscription');
    expect(normalized.flags).toContain('digital_service');
  }, 30000); // Increased timeout for API call
});
