import { HttpAuthGuard } from '@easygen/guards/http-auth.guard';
import { RequestWithPayload } from '@easygen/guards/types/request-with-payload';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPasswordApiDto } from './dto/forgot-password.dto';
import { LoginCredentialsApiDto } from './dto/login-credentials.dto';
import { RefreshTokenApiDto } from './dto/refresh-token.dto';
import { ResetPasswordApiDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() login: LoginCredentialsApiDto) {
    return this.authService.login(login.email, login.password);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  logout(@Request() req: RequestWithPayload) {
    return this.authService.logout(req.jwtPayload.userId);
  }

  @Post('refresh')
  @ApiBearerAuth()
  refresh(@Body() body: RefreshTokenApiDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordApiDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordApiDto) {
    return this.authService.resetPassword(body.resetToken, body.password);
  }
}
