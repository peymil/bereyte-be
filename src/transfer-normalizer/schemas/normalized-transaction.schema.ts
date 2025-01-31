import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NormalizedTransactionDocument = NormalizedTransaction & Document;

@Schema({ timestamps: true })
export class NormalizedTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Transaction', required: true })
  transactionId: Types.ObjectId;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true })
  isSubscription: boolean;

  @Prop({ type: [String], default: [] })
  flags: string[];

  @Prop({ type: Date, required: true })
  transactionDate: Date;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ required: true })
  sessionId: string;
}

export const NormalizedTransactionSchema = SchemaFactory.createForClass(
  NormalizedTransaction,
);
