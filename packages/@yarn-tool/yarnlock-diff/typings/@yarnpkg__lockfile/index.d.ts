interface IPackageData {
  version: string;
  resolved: string;
  integrity: string;
  dependencies: Record<string, string>;
}

interface ILockData {
  type: "success";
  object: Record<string, IPackageData>;
}

declare module "@yarnpkg/lockfile" {
  export const parse: <T extends ILockData>(data: string) => T;
  export const stringify: <T extends ILockData>(object: T) => string;
}
