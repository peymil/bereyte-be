import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionPatternDocument = TransactionPattern & Document;

export enum PatternType {
  SUBSCRIPTION = 'subscription',
  RECURRING = 'recurring',
  PERIODIC = 'periodic',
}

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Schema({ timestamps: true })
export class TransactionPattern {
  @Prop({ required: true, enum: PatternType })
  type: PatternType;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, enum: FrequencyType })
  frequency: FrequencyType;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence: number;

  @Prop({ required: true, type: Date })
  nextExpected: Date;

  @Prop({ type: Date })
  lastOccurrence: Date;

  @Prop({ type: Number, default: 0 })
  occurrenceCount: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: true })
  sessionId: string;
}

export const TransactionPatternSchema =
  SchemaFactory.createForClass(TransactionPattern);
