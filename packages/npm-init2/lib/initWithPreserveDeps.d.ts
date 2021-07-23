import { IPackageJson } from '@ts-type/package-dts';
export declare function initWithPreserveDeps({ npmClient, cwd, args, old_pkg, pkg_file_path }: {
    npmClient: string;
    cwd: string;
    args: string[];
    old_pkg: IPackageJson;
    pkg_file_path: string;
}): {
    cp: import("cross-spawn-extra").SpawnSyncReturns<Buffer>;
};
export default initWithPreserveDeps;
