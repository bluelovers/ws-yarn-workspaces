import { Diff } from "deep-diff";
import { Option } from "fp-ts/lib/Option";
export declare function buildDiff(oldYarnLockContent: string[], newYarnLockContent: string[]): Option<Diff<{}, {}>[]>;
