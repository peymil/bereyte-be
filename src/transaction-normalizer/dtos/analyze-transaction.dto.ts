import { ApiProperty } from '@nestjs/swagger';

export class NormalizedTransactionData {
  @ApiProperty()
  merchant: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ name: 'sub_category' })
  sub_category: string;

  @ApiProperty()
  confidence: number;

  @ApiProperty({ name: 'is_subscription' })
  is_subscription: boolean;

  @ApiProperty({ type: [String] })
  flags: string[];
}

export class NormalizedTransactionResponse {
  @ApiProperty({ type: NormalizedTransactionData })
  normalized: NormalizedTransactionData;
}
