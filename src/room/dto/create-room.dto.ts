import { IsNotEmpty, IsEnum } from 'class-validator';
import { LedInfo } from '../entities/room.schema';

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  leds: LedInfo[];
  @IsNotEmpty()
  humidity: number;
  @IsNotEmpty()
  temperature: number;
  amount_gymers: number;
}
