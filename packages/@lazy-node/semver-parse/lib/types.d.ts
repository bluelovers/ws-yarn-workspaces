import { ITSPartialRecord } from 'ts-type/lib/type/record';
export interface ISimpleSemVerObject {
    operator?: string;
    version?: string;
    semver: string;
    major: string;
    minor?: string;
    patch?: string;
    release?: string;
    build?: string;
}
export interface ISimpleSemVerObjectWithOperator extends ISimpleSemVerObject {
    operator: string;
}
export interface ISimpleSemVerOperator extends ITSPartialRecord<Exclude<keyof ISimpleSemVerObject, 'operator'>, never> {
    operator: string;
}
export declare type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;
export declare type IHasOperator<T extends ISimpleSemVer> = T & {
    operator: string;
};
