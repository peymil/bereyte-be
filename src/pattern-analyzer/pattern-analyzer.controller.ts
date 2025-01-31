import { Controller, Post, Req } from '@nestjs/common';
import { PatternAnalyzerService } from './pattern-analyzer.service';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzePatternsResponse } from './dtos/analyze-patterns.dto';

@ApiTags('Pattern Analysis')
@Controller('api/analyze')
export class PatternAnalyzerController {
  constructor(private readonly patternAnalyzerService: PatternAnalyzerService) {}

  @Post('patterns')
  @ApiOperation({ summary: 'Analyze patterns in session transactions' })
  @ApiResponse({
    status: 200,
    description: 'Patterns successfully detected',
    type: AnalyzePatternsResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid session' })
  async analyzePatterns(@Req() req: Request) {
    return this.patternAnalyzerService.analyzePatterns(req.session.id);
  }
}