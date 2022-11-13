import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { Room, RoomSchema } from './entities/room.schema';
import { IotController } from './room.controller';
import { IotService } from './room.service';

@Module({
  imports: [
    SocketModule,
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [IotController],
  providers: [IotService],
  
})
export class IotModule {}
