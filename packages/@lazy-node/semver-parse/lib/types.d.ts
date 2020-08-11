import { ITSPartialRecord, ITSRequiredPick } from 'ts-type/lib/type/record';
export declare type IOperatorBase = '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '=' | '~>';
export declare type IOperator = IOperatorBase | string;
export interface ISimpleSemVerObjectBase {
    operator?: IOperator;
    version?: string;
    semver?: string;
    major?: string;
    minor?: string;
    patch?: string;
    release?: string;
    build?: string;
}
export interface ISimpleSemVerObject extends IToSimpleSemVerObject<ISimpleSemVerObjectBase> {
    semver?: string;
}
export interface ISimpleSemVerObjectWithOperator extends IHasOperator<ISimpleSemVerObject> {
}
export interface ISimpleSemVerOperator extends ITSPartialRecord<Exclude<keyof ISimpleSemVerObjectBase, 'operator'>, never>, ITSRequiredPick<ISimpleSemVerObjectBase, 'operator'> {
}
export declare type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;
export declare type IHasOperator<T extends ISimpleSemVerObjectBase> = T & {
    operator: IOperator;
};
export declare type IToSimpleSemVerOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<T> & {
    major?: never;
};
export declare type IToSimpleSemVerObject<T extends ISimpleSemVerObjectBase> = T & {
    major: string;
};
export declare type IToSimpleSemVerObjectWithOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<IToSimpleSemVerObject<T>>;
export declare type IToSimpleSemVerObjectOrOperator<T extends ISimpleSemVerObjectBase> = IToSimpleSemVerOperator<T> | IToSimpleSemVerObject<T>;
