import { ConfigType, registerAs } from '@nestjs/config';

export type ApiGatewayConfigType = ConfigType<typeof ApiGatewayConfig>;

export const ApiGatewayConfig = registerAs('api-gateway', () => ({
  port: parseInt(process.env.API_GATWAY_PORT ?? '', 10),
  authenticationServiceUrl: process.env.AUTH_SERVICE_URL,
  originPattern: process.env.CROSS_ORIGIN_PATTERN,
  originMethods: process.env.CROSS_ORIGIN_METHODS,
  preflightContinue: process.env.CROSS_ORIGIN_PREFLIGHT_CONTINUE === 'false',
  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  optionsSuccessStatus: parseInt(
    process.env.CROSS_ORIGIN_OPTIONS_SUCCESS_STATUS ?? '',
    10,
  ),
}));
