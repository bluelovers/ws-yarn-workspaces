import { IHasOperator, ISimpleSemVerObjectBase } from './types';
export declare function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T> & {
    major?: never;
};
export declare function assertSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IHasOperator<T> & {
    major?: never;
};
export declare function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is T & {
    major: string;
};
export declare function assertSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is T & {
    major: string;
};
export declare function hasOperator<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T>;
export declare function assertHasOperator<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IHasOperator<T>;
