import { IOptionsGetRunPathCore, IOptionsFindBinPath, ProcessEnv } from './index';
import { IPathDelimiter } from '@yarn-tool/env-path';
export declare function findBinPath(options?: IOptionsFindBinPath): {
    result: string[];
    history: string[];
};
export declare function getExePath(options: IOptionsGetRunPathCore): string;
export declare function processRunPathCore<P = ProcessEnv>(options?: IOptionsGetRunPathCore<P>): {
    pathKey: string;
    envPath: any;
    binPaths: string[];
    execPath: string;
    delimiter: IPathDelimiter;
    processEnv: P;
};
