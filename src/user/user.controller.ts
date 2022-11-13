import { Controller, Get ,Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello() {
    return this.userService.getAllUser();
  }
  @Get('user-info')
  getUserInfo(@Query() user_od) {
    return this.userService.getUserInfo(user_od);
  }
}
