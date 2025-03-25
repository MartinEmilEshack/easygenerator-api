import { GuardsModule } from '@easygen/guards';
import { getProtoPaths, ProtoPackage } from '@easygen/proto';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    GuardsModule,
    ClientsModule.registerAsync([
      {
        name: ProtoPackage.USERS_AUTH,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (sysConfig: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: sysConfig.get('api-gateway.authenticationServiceUrl'),
            package: ProtoPackage.USERS_AUTH,
            protoPath: getProtoPaths(ProtoPackage.USERS_AUTH),
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
