export enum RoomTopic {
  CONTROLL_LED = 'home/room/led',
  SUB_SENSOR = 'home/room/sensor',
}

export interface RoomSensorPayload {
  temp: string;
  hum: string;
}
