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
}
