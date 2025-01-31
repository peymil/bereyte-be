import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: String })
  source?: string;

  @Prop({ required: true })
  sessionId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
