import { Argv } from 'yargs';
export declare function setupYarnAddToYargs<T extends any>(yargs: Argv<T>, opts?: {
    allowEmptyName?: boolean;
}): Argv<T & {
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
}>;
