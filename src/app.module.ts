import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';
import { RollCallModule } from './roll-call/roll-call.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttModule } from 'nest-mqtt';
import { IotModule } from './room/room.module';

@Module({
  imports: [
    MqttModule.forRoot({
      host: 'dfbd389814bd4a7a9897038c99700f75.s2.eu.hivemq.cloud',
      port: 8883,
      username: 'redutdep13',
      password: 'redutdep17',
      protocol: 'mqtts',
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    RollCallModule,
    AuthModule,
    IotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
