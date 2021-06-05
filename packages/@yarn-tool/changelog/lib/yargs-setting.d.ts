/**
 * Created by user on 2020/6/15.
 */
import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    preset: string;
} & {
    "lerna-package": boolean;
} & {
    type: string;
} & {
    "tag-prefix": string;
} & {
    cwd: string;
}>>;
export default setupToYargs;
