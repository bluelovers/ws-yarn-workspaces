import { IResult } from './types';
export declare function assertNpaResultHasName<T extends IResult>(result: T): asserts result is T & {
    name: string;
};
