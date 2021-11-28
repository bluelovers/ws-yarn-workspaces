/**
 * Created by user on 2019/5/16.
 */
import yargs from 'yargs';
import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<yargs.Argv<yargs.Omit<T, never> & {
    npmClient: string;
} & {
    yes: boolean;
} & {
    cwd: string;
} & {
    skipCheckWorkspace: boolean;
} & {
    force: boolean;
} & {
    sort: boolean;
} & {
    private: boolean;
} & {
    createModule: string;
} & {
    name: string;
} & {
    copyStatic: boolean;
} & {
    tsdx: boolean;
}>>;
export default setupToYargs;
