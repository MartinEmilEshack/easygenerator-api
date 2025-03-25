import { ConfigType, registerAs } from '@nestjs/config';

export const AuthServiceDatabaseConfig = registerAs('database', () => ({
  uri: process.env.MONGO_DB_URI,
  authSource: process.env.MONGO_DB_AUTHSOURCE,
  auth: {
    username: process.env.MONGO_DB_USERNAME,
    password: process.env.MONGO_DB_PASSWORD,
  },
}));

export type AuthServiceTokensConfigType = ConfigType<
  typeof AuthServiceTokensConfig
>;

export const AuthServiceTokensConfig = registerAs('tokens', () => ({
  authServiceIssuarName: process.env.AUTH_SERVICE_ISSUAR_NAME,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  accessTokenExpirySec: parseInt(process.env.ACCESS_TOKEN_EXPIRY_SEC ?? '', 10),
  refreshTokenExpiryDays: process.env.REFRESH_TOKEN_EXPIRY_DAYS,
  resetPasswordTokenExpirySec: parseInt(
    process.env.RESET_PASSWORD_TOKEN_EXPIRY_SEC ?? '',
    10,
  ),
}));

export type AuthServicePasswordHashConfigType = ConfigType<
  typeof AuthServicePasswordHashConfig
>;

export const AuthServicePasswordHashConfig = registerAs('hash', () => ({
  hashRounds: parseInt(process.env.PASSWORD_HASH_ROUNDS ?? '', 10),
}));

export type AuthServiceHostConfigType = ConfigType<
  typeof AuthServiceHostConfig
>;
export const AuthServiceHostConfig = registerAs('grpc-url', () => ({
  grpcHost: process.env.AUTH_SERVICE_GRPC_HOST,
  grpcPort: parseInt(process.env.AUTH_SERVICE_GRPC_PORT ?? '', 10),
}));
