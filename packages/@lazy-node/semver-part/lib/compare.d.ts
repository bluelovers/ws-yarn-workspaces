/// <reference types="node" />
import { Operator as ISemverOperator, Options as ISemverOptions } from 'semver';
export type { ISemverOperator, ISemverOptions };
export declare type IOptionsOrLoose = boolean | ISemverOptions;
export declare type ICompareReturnType = 1 | 0 | -1;
export declare function compare(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): ICompareReturnType;
export declare function eq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function neq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function gt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function gte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function lt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function lte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function cmp(part1: string, operator: ISemverOperator, part2: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function tryCompare(v1: string, v2: string, optionsOrLoose?: IOptionsOrLoose): import("readline").Direction;