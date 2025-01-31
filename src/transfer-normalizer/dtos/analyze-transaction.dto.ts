import { IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ example: 'AMZN MKTP US*Z1234ABC', description: 'Transaction description' })
  @IsString()
  description: string;

  @ApiProperty({ example: -89.97, description: 'Transaction amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2024-01-15', description: 'Transaction date' })
  @IsDateString()
  date: string;
}

export class AnalyzeTransactionDto {
  @ApiProperty({ type: TransactionDto })
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;
}

export class NormalizedResponseData {
  @ApiProperty({ example: 'Amazon', description: 'Normalized merchant name' })
  merchant: string;

  @ApiProperty({ example: 'Shopping', description: 'Transaction category' })
  category: string;

  @ApiProperty({ example: 'Online Retail', description: 'Transaction sub-category' })
  sub_category: string;

  @ApiProperty({ example: 0.95, description: 'Confidence score of the analysis' })
  confidence: number;

  @ApiProperty({ example: false, description: 'Whether this is a subscription' })
  is_subscription: boolean;

  @ApiProperty({ example: ['online_purchase', 'marketplace'], description: 'Transaction flags' })
  flags: string[];
}

export class NormalizedTransactionResponse {
  @ApiProperty({ type: NormalizedResponseData })
  normalized: NormalizedResponseData;
}