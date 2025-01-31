import { Controller, Post, Delete, Get, HttpCode } from '@nestjs/common';
import { TransactionNormalizerService } from './transaction-normalizer.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NormalizedTransactionResponse } from './dtos/analyze-transaction.dto';

@ApiTags('Transaction Analysis')
@Controller('api/analyze')
export class TransactionNormalizerController {
  constructor(
    private readonly transactionNormalizerService: TransactionNormalizerService,
  ) {}

  @Get('merchant')
  @ApiOperation({
    summary: 'Get all normalized transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'List of normalized transactions',
    type: [NormalizedTransactionResponse],
  })
  async getNormalizedTransactions() {
    return this.transactionNormalizerService.getNormalizedTransactions();
  }

  @Post('merchant')
  @ApiOperation({
    summary: 'Analyze and normalize all transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions successfully analyzed',
    type: [NormalizedTransactionResponse],
  })
  @ApiResponse({ status: 400, description: 'No transactions found' })
  async analyzeMerchant() {
    return this.transactionNormalizerService.analyzeTransactions();
  }

  @Delete('merchant')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete all normalized transactions' })
  @ApiResponse({
    status: 204,
    description: 'All normalized transactions deleted successfully',
  })
  async deleteAllNormalizedTransactions() {
    await this.transactionNormalizerService.deleteAllNormalizedTransactions();
  }
}
