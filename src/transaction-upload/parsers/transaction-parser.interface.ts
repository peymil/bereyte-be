export interface ParsedTransaction {
  description: string;
  amount: number;
  date: string;
}

export interface TransactionParser {
  parse(fileBuffer: Buffer): Promise<ParsedTransaction[]>;
  supports(filename: string): boolean;
}