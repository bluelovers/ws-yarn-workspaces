import { Argv } from 'yargs';
export declare function setupNcuToYargs2<T extends any>(yargs: Argv<T & {
    cwd: string;
}>): Argv<T & {
    cwd: string;
} & {
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
    resolutions: boolean;
} & {
    "no-safe": boolean;
} & {
    AA: boolean;
}>;
