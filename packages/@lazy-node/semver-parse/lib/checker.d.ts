import { ISimpleSemVerOperator, ISimpleSemVerObject, IHasOperator, ISimpleSemVerObjectBase } from './types';
export declare function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is Extract<T, ISimpleSemVerOperator>;
export declare function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is Extract<T, ISimpleSemVerObject>;
export declare function hasOperator<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T>;
