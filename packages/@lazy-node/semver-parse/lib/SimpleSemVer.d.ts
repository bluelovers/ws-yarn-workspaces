import { ISimpleSemVer, ISimpleSemVerObjectBase, IHasOperator, IOperator, IToSimpleSemVerObject, IToSimpleSemVerOperator, IToSimpleSemVerObjectOrOperator } from './types';
export declare class SimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer> implements ISimpleSemVerObjectBase {
    readonly semver?: string;
    readonly operator?: IOperator;
    readonly version?: string;
    readonly major?: string;
    readonly minor?: string;
    readonly patch?: string;
    readonly release?: string;
    readonly build?: string;
    constructor(obj: T);
    static create<T extends ISimpleSemVer = ISimpleSemVer>(version: string): IToSimpleSemVerObjectOrOperator<SimpleSemVer<T>>;
    isValid(): this is IToSimpleSemVerObjectOrOperator<SimpleSemVer<IToSimpleSemVerObjectOrOperator<T>>>;
    isValidOperator(): this is IToSimpleSemVerOperator<SimpleSemVer<IToSimpleSemVerOperator<T>>>;
    isValidObject(): this is IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>;
    hasOperator(): this is IHasOperator<SimpleSemVer<IHasOperator<T>>>;
    toJSON(): T;
    toString(): string;
    toFullString(): string;
}
export default SimpleSemVer;
