import { ApiProperty } from '@nestjs/swagger';

export class NormalizedTransactionData {
  @ApiProperty()
  merchant: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  subCategory: string;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  isSubscription: boolean;

  @ApiProperty({ type: [String] })
  flags: string[];
}

export class NormalizedTransactionResponse {
  @ApiProperty({ type: NormalizedTransactionData })
  normalized: NormalizedTransactionData;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  _id: string;
}
