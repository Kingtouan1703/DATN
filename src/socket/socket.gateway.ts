import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class SocketGateway implements OnGatewayInit {
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
}
