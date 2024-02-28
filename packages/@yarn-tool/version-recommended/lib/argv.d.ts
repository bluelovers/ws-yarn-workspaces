import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
/**
 * @see https://classic.yarnpkg.com/lang/en/docs/cli/version/
 */
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    "no-git-tag-version": boolean;
} & {
    "no-commit-hooks": boolean;
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
} & {
    preid: string;
} & {
    "default-preid": string;
}>>;
