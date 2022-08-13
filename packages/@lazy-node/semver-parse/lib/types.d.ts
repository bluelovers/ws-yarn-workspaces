import { ITSPartialRecord, ITSRequiredPick } from 'ts-type/lib/type/record';
export type IOperatorBase = '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '=' | '~>';
export type IOperator = IOperatorBase | string;
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
export type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;
export type IHasOperator<T extends ISimpleSemVerObjectBase> = T & {
    operator: IOperator;
};
export type IToSimpleSemVerOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<T> & {
    major?: never;
};
export type IToSimpleSemVerObject<T extends ISimpleSemVerObjectBase> = T & {
    major: string;
};
export type IToSimpleSemVerObjectWithOperator<T extends ISimpleSemVerObjectBase> = IHasOperator<IToSimpleSemVerObject<T>>;
export type IToSimpleSemVerObjectOrOperator<T extends ISimpleSemVerObjectBase> = IToSimpleSemVerOperator<T> | IToSimpleSemVerObject<T>;
