import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RollCallDocument = RollCall & Document;

@Schema({ timestamps: true })
export class RollCall {
  @Prop({ required: true })
  user_id: string;
  @Prop({ required: true })
  date: string;
}

export const RollCallSchema = SchemaFactory.createForClass(RollCall);
