import { readdirSync } from 'fs';
import { AUTH_EASYGEN_PACKAGE_NAME } from './schemas/auth';
import { USERS_AUTH_EASYGEN_PACKAGE_NAME } from './schemas/users.auth';

export enum ProtoPackage {
  AUTH = AUTH_EASYGEN_PACKAGE_NAME,
  USERS_AUTH = USERS_AUTH_EASYGEN_PACKAGE_NAME,
}

export const getProtoPaths = (...packageNames: ProtoPackage[]) => {
  const mainPackages: string[] = [];

  packageNames.forEach((packageName) => {
    const packageDomains = packageName.split('.');
    packageDomains.pop();
    const packageFileName = packageDomains.join('.');

    const packProtoFiles = readdirSync('libs/proto/src')
      .filter((fileName) => fileName.endsWith(`${packageFileName}.proto`))
      .map((fileName) => `libs/proto/src/${fileName}`);

    mainPackages.push(...packProtoFiles);
  });

  return mainPackages;
};
