import { Argv } from 'yargs';
export declare function setupYarnAddTypesToYargs<T extends any>(yargs: Argv<T>): Argv<T & {
    dev: boolean;
} & {
    peer: boolean;
} & {
    optional: boolean;
} & {
    exact: boolean;
} & {
    tilde: boolean;
} & {
    audit: boolean;
} & {
    dedupe: boolean;
} & {
    "ignore-workspace-root-check": boolean;
} & {
    types: boolean;
} & {
    auto: boolean;
} & {
    all: boolean;
} & {
    AA: boolean;
}>;
