export interface TransactionNormalizerInput {
  description: string;
  amount: number;
  date: string;
}

export interface NormalizedTransactionOutput {
  merchant: string;
  category: string;
  subCategory: string;
  confidence: number;
  isSubscription: boolean;
  flags: string[];
}

export interface TransactionNormalizerStrategy {
  normalize(
    transaction: TransactionNormalizerInput,
  ): Promise<NormalizedTransactionOutput>;
}
