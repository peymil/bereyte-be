import { ApiProperty } from '@nestjs/swagger';

export class NormalizedData {
  @ApiProperty()
  merchant: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  sub_category: string;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  is_subscription: boolean;

  @ApiProperty({ type: [String] })
  flags: string[];
}

export class NormalizedTransaction {
  @ApiProperty()
  original: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ type: NormalizedData })
  normalized: NormalizedData;
}

export class AnalyzeTransactionResponse {
  @ApiProperty({ type: [NormalizedTransaction] })
  normalized_transactions: NormalizedTransaction[];
}
