import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import { OpenRouterTransactionNormalizerStrategy } from '../transfer-normalizer/strategies/openrouter-transaction-normalizer.strategy';
import { OpenRouterPatternDetectorStrategy } from '../pattern-analyzer/strategies/openrouter-pattern-detector.strategy';

@Module({
  imports: [ConfigModule],
  providers: [OpenAIService],
})
export class AIModule {}
