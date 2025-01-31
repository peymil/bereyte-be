import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import { OpenRouterTransactionNormalizerStrategy } from './strategies/openrouter-transaction-normalizer.strategy';
import { OpenRouterPatternDetectorStrategy } from './strategies/openrouter-pattern-detector.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    OpenAIService,
    OpenRouterTransactionNormalizerStrategy,
    OpenRouterPatternDetectorStrategy,
  ],
  exports: [
    OpenRouterTransactionNormalizerStrategy,
    OpenRouterPatternDetectorStrategy,
  ],
})
export class AIModule {}
