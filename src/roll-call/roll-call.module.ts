import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { RollCall, RollCallSchema } from './entities/roll-call.schema';
import { RollcallController } from './roll-call.controller';
import { RollCallServices } from './roll-call.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: RollCall.name, schema: RollCallSchema }]),
  ],
  controllers: [RollcallController],
  providers: [RollCallServices],
})
export class RollCallModule {}
