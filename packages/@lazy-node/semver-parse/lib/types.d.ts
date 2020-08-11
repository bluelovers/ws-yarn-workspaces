export declare type IOperatorBase = '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '=' | '~>';
export declare type IOperator = IOperatorBase | string;
export interface ISimpleSemVerObjectBase {
    operator?: IOperator;
    version?: string;
    semver: string;
    major?: string;
    minor?: string;
    patch?: string;
    release?: string;
    build?: string;
}
export interface ISimpleSemVerObject extends ISimpleSemVerObjectBase {
    major: string;
}
export interface ISimpleSemVerObjectWithOperator extends ISimpleSemVerObject {
    operator: IOperator;
}
export interface ISimpleSemVerOperator extends ISimpleSemVerObjectBase {
    operator: IOperator;
}
export declare type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;
export declare type IHasOperator<T extends ISimpleSemVerObjectBase> = T & {
    operator: IOperator;
};
