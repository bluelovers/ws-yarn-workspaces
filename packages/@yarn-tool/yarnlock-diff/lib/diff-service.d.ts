import { ITSValueOrArray } from 'ts-type/lib/type/base';
export declare function buildDiff(oldYarnLockContent: ITSValueOrArray<Buffer | string>, newYarnLockContent: ITSValueOrArray<Buffer | string>): import("@bluelovers/deep-diff").IDiffNode<import("./diff-service/types").IComputedPackage, import("./diff-service/types").IComputedPackage>[];
