/**
 * Created by user on 2020/6/15.
 */
import yargs, { Argv } from 'yargs';
export declare function setupToYargs<T>(yargs: Argv<T>): yargs.Argv<T & {
    cwd: string;
} & {
    "tag-prefix": string;
} & {
    "exclude-name": boolean;
} & {
    message: string;
} & {
    "force-git-tag": boolean;
} & {
    "sign-git-tag": boolean;
}>;
export default setupToYargs;
