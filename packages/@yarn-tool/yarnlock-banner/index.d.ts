/// <reference types="node" />
export declare enum EnumYarnLockBanner {
    v1 = "# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n# yarn lockfile v1",
    v2 = "# This file is generated by running \"yarn install\" inside your project.\n# Manual changes might be lost - proceed with caution!"
}
export declare function existsYarnLockBanner(yarnlock_old: Buffer | string): {
    banner: string;
    content: string;
};
export default existsYarnLockBanner;
