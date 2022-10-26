import { Body, Controller, Get, Post ,Request,UseGuards  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
export class TestDto {
  username: string;
  password: string;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('test')
  async test(@Body() testDto: TestDto) {
    return this.authService.validateUser(testDto.username, testDto.password);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
