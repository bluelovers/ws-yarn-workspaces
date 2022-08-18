/**
 * Created by user on 2020/6/12.
 */
import { Argv } from 'yargs';
/**
 * @see https://github.com/raineorshine/npm-check-updates/blob/main/src/cli-options.ts
 */
export declare function setupNcuToYargs<T extends any>(yargs: Argv<T>): Argv<T & {
    dep: string;
} & {
    minimal: boolean;
} & {
    newest: boolean;
} & {
    packageManager: string;
} & {
    registry: string;
} & {
    silent: boolean;
} & {
    greatest: boolean;
} & {
    upgrade: boolean;
} & {
    semverLevel: string;
} & {
    removeRange: boolean;
} & {
    dedupe: boolean;
} & {
    filter: (string | number)[];
}>;
export default setupNcuToYargs;
