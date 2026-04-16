import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-auth')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  // POST /user-auth/register
  @Post('register')
  register(@Body() body: { name: string; email: string; password: string }) {
    return this.userAuthService.register(body.name, body.email, body.password);
  }

  // POST /user-auth/login
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userAuthService.login(body.email, body.password);
  }

  // GET /user-auth/profile  (protected)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.userAuthService.getProfile(req.user.adminId);
  }
}