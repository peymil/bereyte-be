import { Injectable } from '@nestjs/common';
import { TransactionParser } from './transaction-parser.interface';
import { CsvTransactionParser } from './csv-transaction.parser';

@Injectable()
export class TransactionParserFactory {
  constructor(private readonly csvParser: CsvTransactionParser) {}

  getParser(filename: string): TransactionParser {
    if (this.csvParser.supports(filename)) {
      return this.csvParser;
    }

    throw new Error(`Unsupported file type: ${filename}`);
  }
}