import { IsNotEmpty, IsEnum } from 'class-validator';

export enum StateEnum {
  ON = 'ON',
  OFF = 'OFF',
}

export class ControllLEDDTo {
  @IsNotEmpty()
  led_number: string;
  @IsEnum(StateEnum, { message: 'Led state must be ON or OFF' })
  state;
}
