import { IOptionsGetRunPathCore, IOptionsFindBinPath, ProcessEnv } from './index';
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
    delimiter: string;
    processEnv: P;
};
