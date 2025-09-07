import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';
export declare function isUpdateAbleVersionByNpmPackageArgResult<T extends IResult>(npaResult: T): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & {
    operator: import("@lazy-node/semver-simple-parse/lib/types").IOperator;
} & {
    major?: never;
} & {
    major: string;
});
export declare function isUpdateAbleVersion(version: string): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & {
    operator: import("@lazy-node/semver-simple-parse/lib/types").IOperator;
} & {
    major?: never;
} & {
    major: string;
});
export declare function handleSemverForDependencies(packageName: string): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & {
    operator: import("@lazy-node/semver-simple-parse/lib/types").IOperator;
} & {
    major?: never;
} & {
    major: string;
});
