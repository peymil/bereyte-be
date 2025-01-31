import {
  FrequencyType,
  PatternType,
} from './schemas/transaction-pattern.schema';

export interface Transaction {
  description: string;
  amount: number;
  date: string;
}

export interface DetectedPattern {
  type: PatternType;
  merchant: string;
  amount: number;
  frequency: FrequencyType;
  confidence: number;
  nextExpected: string;
}

export interface PatternDetectorStrategy {
  detectPatterns(transactions: Transaction[]): Promise<DetectedPattern[]>;
}
