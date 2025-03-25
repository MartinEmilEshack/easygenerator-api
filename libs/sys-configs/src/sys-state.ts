import { ConfigType, registerAs } from '@nestjs/config';

export type SystemStateConfigType = ConfigType<typeof SystemStateConfig>;

export const SystemStateConfig = registerAs('system-state', () => ({
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  isLocal: process.env.NODE_ENV === 'local',

  websiteUrl: process.env.WEBSITE_URL ?? '',
}));
