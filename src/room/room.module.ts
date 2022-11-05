import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './entities/room.schema';
import { IotController } from './room.controller';
import { IotService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [IotController],
  providers: [IotService],
})
export class IotModule {}
