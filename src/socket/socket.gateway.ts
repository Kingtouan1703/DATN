import { Inject, Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MqttService, Subscribe, Payload } from 'nest-mqtt';
import { Server } from 'socket.io';
import { AttendancePayload, LeavePayload, RollCallTopic } from 'src/roll-call/topic/topic';
import { RoomSensorPayload, RoomTopic } from 'src/room/topic/room.topic';

@WebSocketGateway({ cors: '*:*' })
export class SocketGateway implements OnGatewayInit {
  @Inject(MqttService) private readonly mqttService: MqttService;
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('WSGateway');
  afterInit(server: any) {
    this.logger.debug('afterInit..............................');
  }
  @SubscribeMessage('test_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit('receive_message', data);
  }
  // mqtt => socket emit
  @Subscribe(RoomTopic.SUB_SENSOR)
  emitTest(@Payload() payload: RoomSensorPayload) {
    this.server.sockets.emit('room_sensor', payload);
  }
  @Subscribe(RollCallTopic.ATTENDACE)
  IncreaseUsers(@Payload() payload: AttendancePayload) {
    this.server.sockets.emit('user_amount', payload);
  }
  @Subscribe(RollCallTopic.LEAVE)
  DecreaseUsers(@Payload() payload: LeavePayload) {
    this.server.sockets.emit('user_amount', payload);
  }
}
