import { ISimpleSemVerObject, ISimpleSemVer, ISimpleSemVerObjectBase, ISimpleSemVerOperator, IHasOperator, IOperator } from './types';
export declare class SimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer> implements ISimpleSemVerObjectBase {
    readonly semver: string;
    readonly operator?: IOperator;
    readonly version?: string;
    readonly major?: string;
    readonly minor?: string;
    readonly patch?: string;
    readonly release?: string;
    readonly build?: string;
    constructor(obj: T);
    static create<T extends ISimpleSemVer = ISimpleSemVer>(version: string): SimpleSemVer<T>;
    isValidOperator(): this is SimpleSemVer<ISimpleSemVerOperator>;
    isValidObject(): this is SimpleSemVer<ISimpleSemVerObject>;
    hasOperator(): this is SimpleSemVer<IHasOperator<T>>;
    toJSON(): T;
    toString(): string;
    toFullString(): string;
}
export default SimpleSemVer;
