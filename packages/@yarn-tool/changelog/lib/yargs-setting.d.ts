/**
 * Created by user on 2020/6/15.
 */
import { Argv } from 'yargs';
export declare function setupToYargs<T>(yargs: Argv<T>): Argv<T & {
    preset: string;
} & {
    "lerna-package": boolean;
} & {
    type: string;
} & {
    "tag-prefix": string;
}>;
export default setupToYargs;
