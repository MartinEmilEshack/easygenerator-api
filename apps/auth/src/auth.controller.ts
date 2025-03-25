import { Controller } from '@nestjs/common';
import {
  AccessTokenDto,
  AccessTokenPayloadDto,
  ActionConfirmationDto,
  AuthServiceController,
  AuthServiceControllerMethods,
  ForgotPasswordDto,
  JwtDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from 'libs/proto/schemas/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  login(request: LoginDto): Promise<JwtDto> | Observable<JwtDto> | JwtDto {
    return this.authService.login(request.email, request.password);
  }

  logout(
    request: LogoutDto,
  ):
    | Promise<ActionConfirmationDto>
    | Observable<ActionConfirmationDto>
    | ActionConfirmationDto {
    return this.authService.logout(request.userId);
  }

  refresh(
    request: RefreshTokenDto,
  ): Promise<JwtDto> | Observable<JwtDto> | JwtDto {
    return this.authService.refreshAccessToken(request.refreshToken);
  }

  getPayload(
    request: AccessTokenDto,
  ):
    | Promise<AccessTokenPayloadDto>
    | Observable<AccessTokenPayloadDto>
    | AccessTokenPayloadDto {
    return this.authService.getAccessTokenPayload(request.token);
  }

  forgotPassword(
    request: ForgotPasswordDto,
  ):
    | Promise<ActionConfirmationDto>
    | Observable<ActionConfirmationDto>
    | ActionConfirmationDto {
    return this.authService.forgotPassword(request.email);
  }

  resetPassword(
    request: ResetPasswordDto,
  ):
    | Promise<ActionConfirmationDto>
    | Observable<ActionConfirmationDto>
    | ActionConfirmationDto {
    return this.authService.resetPassword(request.resetToken, request.password);
  }
}
