import { Console2 } from 'debug-color2';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IUnpackYargsArgv } from '@yarn-tool/yargs-util';
import { setupNcuToYargs2 } from './argv';
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
export interface IRuntimeInput {
    console: Console2;
    consoleDebug: Console2;
    printRootData(rootData: IFindRootReturnType, argv: {
        cwd: string;
    }): void;
}
export interface IRuntime extends IRuntimeInput {
    cwd: string;
    rootData: IFindRootReturnType;
    pkg_file: string;
    pkg_data: IPackageJson;
    resolutions: IDependency;
    pkg_file_ws: string;
    pkg_data_ws: IPackageJson;
    doWorkspace: boolean;
}
export type IArgvRuntime = IUnpackYargsArgv<ReturnType<typeof setupNcuToYargs2>>;
