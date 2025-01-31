import { Transaction } from 'src/transaction-upload/schemas/transaction.schema';
import { NormalizedTransaction } from './schemas/normalized-transaction.schema';

export interface TransactionNormalizer {
  normalize(transaction: Transaction): Promise<NormalizedTransaction>;
}
