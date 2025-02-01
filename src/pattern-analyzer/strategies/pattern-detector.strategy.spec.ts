import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../config/env.config';
import { OpenAIService } from '../../ai/openai.service';
import { Gpt35PatternDetectorStrategy } from './gpt35-pattern-detector.strategy';
import { Transaction } from '../../transaction-upload/schemas/transaction.schema';

describe('Gpt35PatternDetectorStrategy (Integration)', () => {
  let strategy: Gpt35PatternDetectorStrategy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate,
        }),
      ],
      providers: [OpenAIService, Gpt35PatternDetectorStrategy],
    }).compile();

    strategy = moduleFixture.get<Gpt35PatternDetectorStrategy>(
      Gpt35PatternDetectorStrategy,
    );
  });

  it('should detect pattern in Netflix transactions', async () => {
    const transactions: Transaction[] = [
      {
        description: 'NFLX DIGITAL NTFLX US',
        amount: 19.99,
        date: new Date('2024-01-01'),
      },
      {
        description: 'NFLX DIGITAL NTFLX US',
        amount: 19.99,
        date: new Date('2024-02-01'),
      },
    ];

    const result = await strategy.detectPatterns(transactions);

    expect(result.patterns).toBeDefined();
    expect(result.patterns).toHaveLength(1);

    const pattern = result.patterns[0];
    expect(pattern.merchant.toLowerCase()).toContain('netflix');
    expect(pattern.amount).toBe(19.99);
    expect(pattern.frequency.toLowerCase()).toBe('monthly');
    expect(pattern.confidence).toBeGreaterThan(0.8);
    expect(pattern.type.toLowerCase()).toBe('subscription');
    expect(new Date(pattern.next_expected)).toBeInstanceOf(Date);
  }, 30000); // Increased timeout for API call
});
