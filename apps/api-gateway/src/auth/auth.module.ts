import { GuardsModule } from '@easygen/guards';
import { ProtoPackage, getProtoPaths } from '@easygen/proto';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    GuardsModule,
    ClientsModule.registerAsync([
      {
        name: ProtoPackage.AUTH,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (sysConfig: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: sysConfig.get('api-gateway.authenticationServiceUrl'),
            package: ProtoPackage.AUTH,
            protoPath: getProtoPaths(ProtoPackage.AUTH),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
