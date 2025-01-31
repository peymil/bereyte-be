import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionParserFactory } from './parsers/transaction-parser.factory';
import { CsvTransactionParser } from './parsers/csv-transaction.parser';
import { TransactionUploadController } from './transaction-upload.controller';
import { TransactionUploadService } from './transaction-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionUploadController],
  providers: [
    TransactionUploadService,
    TransactionParserFactory,
    CsvTransactionParser,
  ],
  exports: [TransactionUploadService],
})
export class TransactionUploadModule {}