import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway],
  exports: [],
})
export class SocketModule {}
