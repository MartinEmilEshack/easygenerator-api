import { ProtoPackage, getProtoPaths } from '@easygen/proto';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpAuthGuard } from './http-auth.guard';

@Module({
  imports: [
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
  providers: [HttpAuthGuard],
  exports: [HttpAuthGuard, ClientsModule],
})
export class GuardsModule {}
