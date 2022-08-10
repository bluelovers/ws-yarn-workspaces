import { IArgvRuntime, IRuntimeInput } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function _handleRuntime(argv: IArgvRuntime, runtimeInput: IRuntimeInput): {
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    pkg_file: string;
    pkg_data: IPackageJson<any>;
    resolutions: import("@ts-type/package-dts/package-json").IDependency<string[]>;
    pkg_file_ws: string;
    pkg_data_ws: IPackageJson<any>;
    doWorkspace: boolean;
    console: import("debug-color2").Console2;
    consoleDebug: import("debug-color2").Console2;
    printRootData(rootData: import("@yarn-tool/find-root").IFindRootReturnType, argv: {
        cwd: string;
    }): void;
};
