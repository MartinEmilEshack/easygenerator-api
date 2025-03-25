import {
  AuthServiceTokensConfig,
  AuthServiceTokensConfigType,
} from '@easygen/sys-configs/auth-service';
import {
  SystemStateConfig,
  SystemStateConfigType,
} from '@easygen/sys-configs/sys-state';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayloadDto } from 'libs/proto/schemas/auth';
import { AccessTokenPayload } from '../types/access-token-payload';
import { RefreshTokenPayload } from '../types/refresh-token-payload';
import { UserTokenType } from './user-token/types/user-token-type';
import { UserTokenService } from './user-token/user-token.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SystemStateConfig.KEY)
    private sysConfig: SystemStateConfigType,
    @Inject(AuthServiceTokensConfig.KEY)
    private authConfig: AuthServiceTokensConfigType,
    private userService: UsersService,
    private userTokenService: UserTokenService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const signedInAlreadyUser = await this.userTokenService.findOne(
      user._id.toString(),
      UserTokenType.GRANT,
    );

    if (signedInAlreadyUser) {
      await this.userTokenService.remove(
        user._id.toString(),
        UserTokenType.GRANT,
      );
    }

    const userToken = await this.userTokenService.create(
      user._id.toString(),
      UserTokenType.GRANT,
    );

    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email,
      'api-gateway.easygen.service',
    );

    const refreshToken = this.generateRefreshToken(
      userToken.userId,
      userToken.tokenVersion,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user: {
        userId: user._id.toString(),
        email: user.email,
      },
    };
  }

  async logout(userId: string) {
    await this.userTokenService.remove(userId, UserTokenType.GRANT);

    return { message: 'user logged out successfully' };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = this.getRefreshTokenPayload(refreshToken);

    const userToken = await this.userTokenService.findOne(
      payload.userId,
      UserTokenType.GRANT,
    );

    if (userToken && userToken.tokenVersion > payload.tokenVersion) {
      await this.userTokenService.remove(userToken.userId, UserTokenType.GRANT);
      throw new UnauthorizedException('Invalid credentials');
    } else {
      const user = await this.userService.findOne(payload.userId);

      const updatedUserToken =
        await this.userTokenService.incrementTokenVersion(
          payload.userId,
          UserTokenType.GRANT,
        );

      const accessToken = this.generateAccessToken(
        user._id.toString(),
        user.email,
        'api-gateway.easygen.service',
      );

      const newRefreshToken = this.generateRefreshToken(
        user._id.toString(),
        updatedUserToken.tokenVersion,
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60,
        user: { userId: user._id.toString(), email: user.email },
      };
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    const passwordForgotRequest = await this.userTokenService.findOne(
      user._id.toString(),
      UserTokenType.RESET,
    );

    let userTokenVersion = -1;

    if (passwordForgotRequest) {
      const newVersion = await this.userTokenService.incrementTokenVersion(
        user._id.toString(),
        UserTokenType.RESET,
      );

      userTokenVersion = newVersion.tokenVersion;
    } else {
      const userToken = await this.userTokenService.create(
        user._id.toString(),
        UserTokenType.RESET,
      );

      userTokenVersion = userToken.tokenVersion;
    }

    const resetPasswordToken = this.generateResetPasswordAccessToken(
      user._id.toString(),
      userTokenVersion,
      'api-gateway.easygen.service',
    );

    // send email using email microservice with link containing resetPasswordToken

    return {
      message: `reset password email sent with link ${this.sysConfig.websiteUrl}/reset-password?token=${resetPasswordToken}`,
    };
  }

  async resetPassword(resetToken: string, password: string) {
    const payload = this.getResetPasswordTokenPayload(resetToken);

    const resetUserToken = await this.userTokenService.findOne(
      payload.userId,
      UserTokenType.RESET,
    );

    if (resetUserToken && resetUserToken.tokenVersion > payload.tokenVersion)
      throw new UnauthorizedException('Token expired');

    await this.userTokenService.removeAll(payload.userId);

    await this.userService.update(payload.userId, { password });

    return { message: 'Password reset successfully' };
  }

  getAccessTokenPayload(accessToken: string) {
    try {
      const payload = this.jwtService.verify<AccessTokenPayloadDto>(
        accessToken,
        { secret: this.authConfig.accessTokenSecret },
      );

      return payload;
    } catch (e) {
      throw new ForbiddenException('Access denied');
    }
  }

  private generateAccessToken(
    userId: string,
    email: string,
    ...audience: string[]
  ) {
    const accessTokenPayload: AccessTokenPayload = {
      userId,
      email,
    };

    return this.jwtService.sign(accessTokenPayload, {
      secret: this.authConfig.accessTokenSecret,
      expiresIn: this.authConfig.accessTokenExpirySec,
      issuer: this.authConfig.authServiceIssuarName,
      audience,
    });
  }

  private generateRefreshToken(userId: string, tokenVersion: number) {
    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
      tokenVersion: tokenVersion,
    };

    return this.jwtService.sign(refreshTokenPayload, {
      secret: this.authConfig.refreshTokenSecret,
      expiresIn: this.authConfig.refreshTokenExpiryDays,
    });
  }

  private generateResetPasswordAccessToken(
    userId: string,
    tokenVersion: number,
    ...audience: string[]
  ) {
    const accessTokenPayload: RefreshTokenPayload = {
      userId,
      tokenVersion,
    };

    return this.jwtService.sign(accessTokenPayload, {
      secret: this.authConfig.resetPasswordTokenSecret,
      expiresIn: this.authConfig.resetPasswordTokenExpirySec,
      issuer: this.authConfig.authServiceIssuarName,
      audience,
    });
  }

  private getRefreshTokenPayload(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        { secret: this.authConfig.refreshTokenSecret },
      );

      return payload;
    } catch (e) {
      throw new ForbiddenException('Access denied');
    }
  }

  private getResetPasswordTokenPayload(resetPasswordToken: string) {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        resetPasswordToken,
        { secret: this.authConfig.resetPasswordTokenSecret },
      );

      return payload;
    } catch (e) {
      throw new ForbiddenException('Token Expired');
    }
  }
}
