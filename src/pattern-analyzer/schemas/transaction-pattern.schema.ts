import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionPatternDocument = TransactionPattern & Document;

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Schema({ timestamps: true })
export class TransactionPattern {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, enum: FrequencyType })
  frequency: FrequencyType;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true, type: Date })
  next_expected: Date;
}

export const TransactionPatternSchema =
  SchemaFactory.createForClass(TransactionPattern);
