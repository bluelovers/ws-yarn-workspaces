/// <reference types="node" />
import { Operator, Options } from 'semver';
export type { Operator, Options } from 'semver';
export declare type IOptionsOrLoose = boolean | Options;
export declare type ICompareReturnType = 1 | 0 | -1;
export declare function compare(part1: string, part2: string, optionsOrLoose?: boolean | Options): import("readline").Direction;
export declare function eq(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function neq(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function gt(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function gte(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function lt(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function lte(part1: string, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function cmp(part1: string, operator: Operator, part2: string, optionsOrLoose?: boolean | Options): boolean;
export declare function tryCompare(v1: string, v2: string, optionsOrLoose?: IOptionsOrLoose): import("readline").Direction;
