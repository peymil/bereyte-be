import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { TransactionParserFactory } from './parsers/transaction-parser.factory';

@Injectable()
export class TransactionUploadService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private readonly parserFactory: TransactionParserFactory,
  ) {}

  async processFile(file: Express.Multer.File, sessionId: string) {
    const parser = this.parserFactory.getParser(file.originalname);
    const transactions = await parser.parse(file.buffer);

    const savedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const newTransaction = new this.transactionModel({
          description: transaction.description,
          amount: transaction.amount,
          date: new Date(transaction.date),
          source: file.originalname,
          sessionId,
        });
        return newTransaction.save();
      }),
    );

    return {
      message: 'File processed successfully',
      processed: savedTransactions.length,
      transactions: savedTransactions.map((t) => ({
        id: t._id,
        description: t.description,
        amount: t.amount,
        date: t.date,
      })),
    };
  }
}