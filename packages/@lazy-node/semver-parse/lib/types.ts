import { ITSRequiredWith, ITSPickExtra, ITSPartialRecord  } from 'ts-type/lib/type/record';

export type IOperatorBase = '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '=' | '~>';
export type IOperator = IOperatorBase | string;

export interface ISimpleSemVerObjectBase
{
	operator?: IOperator,
	version?: string,
	semver: string,
	major?: string,
	minor?: string,
	patch?: string,
	release?: string
	build?: string
}

export interface ISimpleSemVerObject extends ISimpleSemVerObjectBase
{
	major: string,
}

export interface ISimpleSemVerObjectWithOperator extends ISimpleSemVerObject
{
	operator: IOperator,
}

export interface ISimpleSemVerOperator extends ISimpleSemVerObjectBase
{
	operator: IOperator,
}

export type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;

export type IHasOperator<T extends ISimpleSemVerObjectBase> = T & {
	operator: IOperator,
}

