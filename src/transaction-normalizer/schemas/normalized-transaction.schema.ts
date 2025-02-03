import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transaction } from '../../transaction-upload/schemas/transaction.schema';

export type NormalizedTransactionDocument = NormalizedTransaction & Document;

@Schema({ timestamps: true })
export class NormalizedTransaction {
  @Prop({ type: Types.ObjectId, ref: Transaction.name, required: true })
  transaction: Transaction;

  @Prop({ required: true })
  original: string;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  sub_category: string;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true })
  is_subscription: boolean;

  @Prop({ type: [String], default: [] })
  flags: string[];

  @Prop({ type: Date, required: true })
  transaction_date: Date;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const NormalizedTransactionSchema = SchemaFactory.createForClass(
  NormalizedTransaction,
);
