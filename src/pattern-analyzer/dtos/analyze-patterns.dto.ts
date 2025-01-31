import { ApiProperty } from '@nestjs/swagger';

export class DetectedPatternResponse {
  @ApiProperty({ example: 'subscription', description: 'Type of pattern detected' })
  type: string;

  @ApiProperty({ example: 'Netflix', description: 'Normalized merchant name' })
  merchant: string;

  @ApiProperty({ example: 19.99, description: 'Expected transaction amount' })
  amount: number;

  @ApiProperty({ example: 'monthly', description: 'Frequency of the pattern' })
  frequency: string;

  @ApiProperty({ example: 0.98, description: 'Confidence score of the pattern detection' })
  confidence: number;

  @ApiProperty({ example: '2024-02-01', description: 'Expected date of next occurrence' })
  next_expected: string;
}

export class AnalyzePatternsResponse {
  @ApiProperty({ type: [DetectedPatternResponse] })
  patterns: DetectedPatternResponse[];
}