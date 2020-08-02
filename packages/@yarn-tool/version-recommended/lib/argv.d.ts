import { Argv } from 'yargs';
export declare function setupToYargs<T>(yargs: Argv<T>): Argv<T & {
    "no-git-tag-version": boolean;
} & {
    "new-version": string;
} & {
    major: boolean;
} & {
    minor: boolean;
} & {
    patch: boolean;
} & {
    premajor: boolean;
} & {
    preminor: boolean;
} & {
    prepatch: boolean;
} & {
    prerelease: boolean;
} & {
    "non-interactive": boolean;
} & {
    bump: string;
}>;
