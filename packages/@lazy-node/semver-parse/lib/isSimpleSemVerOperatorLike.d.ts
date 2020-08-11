import { ISimpleSemVer, ISimpleSemVerOperator, ISimpleSemVerObject, IHasOperator } from './types';
export declare function isSimpleSemVerOperatorLike<T extends ISimpleSemVer>(obj: T): obj is Extract<T, ISimpleSemVerOperator>;
export declare function isSimpleSemVerObjectLike<T extends ISimpleSemVer>(obj: T): obj is Extract<T, ISimpleSemVerObject>;
export declare function hasOperator<T extends ISimpleSemVer>(obj: T): obj is IHasOperator<T>;
