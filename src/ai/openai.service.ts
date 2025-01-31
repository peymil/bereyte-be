import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  protected readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/bereyte-be',
        'X-Title': 'Transaction Analysis System',
      },
    });
  }

  protected async createCompletion(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<string> {
    const {
      model = 'openai/gpt-3.5-turbo',
      temperature = 0.3,
      maxTokens = 500,
    } = options;

    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  }

  protected async createStructuredCompletion<T>(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<T> {
    const response = await this.createCompletion(prompt, options);
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}