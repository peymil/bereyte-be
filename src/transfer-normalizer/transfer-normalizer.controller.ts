import { Controller, Post, Req } from '@nestjs/common';
import { TransferNormalizerService } from './transfer-normalizer.service';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NormalizedTransactionResponse } from './dtos/analyze-transaction.dto';

@ApiTags('Transaction Analysis')
@Controller('api/analyze')
export class TransferNormalizerController {
  constructor(private readonly transferNormalizerService: TransferNormalizerService) {}

  @Post('merchant')
  @ApiOperation({ summary: 'Analyze and normalize all transactions in the session' })
  @ApiResponse({
    status: 200,
    description: 'Transactions successfully analyzed',
    type: [NormalizedTransactionResponse],
  })
  @ApiResponse({ status: 400, description: 'Invalid session' })
  async analyzeMerchant(@Req() req: Request) {
    return this.transferNormalizerService.analyzeTransactions(req.session.id);
  }
}