import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;
export interface LedInfo {
  led_number: number;
  state: 'ON' | 'OFF';
}
@Schema({ timestamps: true })
export class Room {
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ required: true })
  leds: LedInfo[];

  @Prop({ required: true })
  humidity: number;
  @Prop({ required: true })
  temperature: number;
  @Prop()
  amount_gymers: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
