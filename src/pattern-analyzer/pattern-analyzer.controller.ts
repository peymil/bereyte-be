import { Controller, Post, Delete, HttpCode } from '@nestjs/common';
import { PatternAnalyzerService } from './pattern-analyzer.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzePatternsResponse } from './dtos/analyze-patterns.dto';

@ApiTags('Pattern Analysis')
@Controller('api/analyze')
export class PatternAnalyzerController {
  constructor(
    private readonly patternAnalyzerService: PatternAnalyzerService,
  ) {}

  @Post('patterns')
  @ApiOperation({ summary: 'Analyze patterns in transactions' })
  @ApiResponse({
    status: 200,
    description: 'Patterns successfully detected',
    type: AnalyzePatternsResponse,
  })
  @ApiResponse({ status: 400, description: 'No transactions found' })
  async analyzePatterns() {
    return this.patternAnalyzerService.analyzePatterns();
  }

  @Delete('patterns')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete all patterns' })
  @ApiResponse({
    status: 204,
    description: 'All patterns deleted successfully',
  })
  async deleteAllPatterns() {
    await this.patternAnalyzerService.deleteAllPatterns();
  }
}
