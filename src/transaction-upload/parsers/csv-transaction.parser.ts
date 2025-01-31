import { Injectable } from '@nestjs/common';
import { ParsedTransaction, TransactionParser } from './transaction-parser.interface';
import { parse } from 'csv-parse';

@Injectable()
export class CsvTransactionParser implements TransactionParser {
  async parse(fileBuffer: Buffer): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
      const records: ParsedTransaction[] = [];

      parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
      })
        .on('data', (record: any) => {
          records.push({
            description: record.description || record.merchant || record.transaction_description,
            amount: this.parseAmount(record.amount || record.transaction_amount),
            date: this.parseDate(record.date || record.transaction_date),
          });
        })
        .on('error', reject)
        .on('end', () => resolve(records));
    });
  }

  supports(filename: string): boolean {
    return filename.toLowerCase().endsWith('.csv');
  }

  private parseAmount(amount: string | number): number {
    if (typeof amount === 'number') return amount;
    // Remove currency symbols and convert to number
    return parseFloat(amount.replace(/[^0-9.-]+/g, ''));
  }

  private parseDate(date: string): string {
    // Try to parse various date formats and return ISO string
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }
    return parsedDate.toISOString().split('T')[0];
  }
}