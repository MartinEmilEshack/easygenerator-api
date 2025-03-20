import { readdirSync } from 'fs';
import { join } from 'path';
import { ProtoPackage } from './@types/packages';

export const getProtoPaths = (
  appPath: string,
  isBuilt: boolean = false,
  ...packageNames: ProtoPackage[]
) => {
  const mainPackages: string[] = [];

  const srcPath = isBuilt
    ? join(appPath, '../../libs/proto/src')
    : 'libs/proto/src';

  packageNames.forEach((packageName) => {
    const packProtoFiles = readdirSync(srcPath)
      .filter((fileName) => fileName.endsWith(`${packageName}.proto`))
      .map((fileName) => `${srcPath}/${fileName}`);

    mainPackages.push(...packProtoFiles);
  });

  return mainPackages;
};

export * from './@types/packages';
