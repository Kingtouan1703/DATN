import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RollCallServices } from './roll-call.service';

@Controller('roll-call')
export class RollcallController {
  constructor(private readonly rollCallServices: RollCallServices) {}

  @Post('register')
  registerFingerprints(@Body() body) {
    return this.rollCallServices.register(body);
  }

  @Post('attendance')
  rollcall(@Body() body) {
    return this.rollCallServices.rollCall(body);
  }

  @Get('time')
  getUserRollCallTime(@Query() user_id) {
    return this.rollCallServices.rollCallTime(user_id);
  }
}
