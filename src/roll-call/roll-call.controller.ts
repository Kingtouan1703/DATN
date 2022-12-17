import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { RollCallServices } from './roll-call.service';
@UseGuards(JwtAuthGuard)
@Controller('roll-call')
export class RollcallController {
  constructor(private readonly rollCallServices: RollCallServices) {}
  
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
 
  @Post('register')
  registerFingerprints(@Body() body) {
    return this.rollCallServices.registerOnline(body);
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
