import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseTransaction {
  @ApiProperty({
    example: '65b7e8c1f3d7a1b2c3d4e5f6',
    description: 'Transaction ID',
  })
  id: string;

  @ApiProperty({ example: 'NETFLIX', description: 'Transaction description' })
  description: string;

  @ApiProperty({ example: -19.99, description: 'Transaction amount' })
  amount: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Transaction date',
  })
  date: Date;
}

export class FileUploadResponse {
  @ApiProperty({
    example: 'File processed successfully',
    description: 'Status message',
  })
  message: string;

  @ApiProperty({ example: 10, description: 'Number of transactions processed' })
  processed: number;

  @ApiProperty({
    type: [UploadResponseTransaction],
    description: 'Processed transactions',
  })
  transactions: UploadResponseTransaction[];
}
