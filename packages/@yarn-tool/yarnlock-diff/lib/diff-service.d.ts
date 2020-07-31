/// <reference types="node" />
import { Diff } from "deep-diff";
import { Option } from "fp-ts/lib/Option";
import { ITSValueOrArray } from 'ts-type/lib/type/base';
import { IComputedPackage } from './diff-service/types';
export declare function buildDiff(oldYarnLockContent: ITSValueOrArray<Buffer | string>, newYarnLockContent: ITSValueOrArray<Buffer | string>): Option<Diff<IComputedPackage, IComputedPackage>[]>;
