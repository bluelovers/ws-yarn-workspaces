/// <reference types="node" />
import { Diff } from "deep-diff";
import { Option } from "fp-ts/lib/Option";
export declare function buildDiff(oldYarnLockContent: (Buffer | string)[], newYarnLockContent: (Buffer | string)[]): Option<Diff<{}, {}>[]>;
