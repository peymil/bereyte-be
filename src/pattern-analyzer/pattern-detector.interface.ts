import { Transaction } from '../transaction-upload/schemas/transaction.schema';
import { AnalyzePatternsResponse } from './dtos/analyze-patterns.dto';

export interface PatternDetectorStrategy {
  detectPatterns(transactions: Transaction[]): Promise<AnalyzePatternsResponse>;
}
