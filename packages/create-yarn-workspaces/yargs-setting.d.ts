/**
 * Created by user on 2019/5/16.
 */
import yargs = require('yargs');
import { Argv } from 'yargs';
export declare function setupWorkspacesInitToYargs<T extends any>(yargs: Argv<T>): yargs.Argv<yargs.Omit<T, never> & {
    name: string;
} & {
    ignoreExistsPackage: boolean;
} & {
    ignoreParentWorkspaces: boolean;
} & {
    debug: boolean;
}>;
export default setupWorkspacesInitToYargs;
