import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    overwriteHostedGitInfo: boolean;
} & {
    branch: string;
} & {
    resetStaticFiles: boolean;
}>>;
