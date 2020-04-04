/**
 * Created by user on 2019/5/16.
 */
import yargs from 'yargs';
import { Argv } from 'yargs';
export declare function setupToYargs<T>(yargs: Argv<T>): yargs.Argv<yargs.Omit<T, never> & {
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
}>;
export default setupToYargs;
