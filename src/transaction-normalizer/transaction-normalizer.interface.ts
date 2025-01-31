import { Transaction } from 'src/transaction-upload/schemas/transaction.schema';
import { NormalizedTransaction } from './schemas/normalized-transaction.schema';

export interface TransactionNormalizer {
  normalize(transactions: Transaction[]): Promise<NormalizedTransaction[]>;
}
