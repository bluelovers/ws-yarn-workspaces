import { ITSRequiredWith, ITSPickExtra, ITSPartialRecord  } from 'ts-type/lib/type/record';

export interface ISimpleSemVerObject
{
	operator?: string,
	version?: string,
	semver: string,
	major: string,
	minor?: string,
	patch?: string,
	release?: string
	build?: string
}

export interface ISimpleSemVerObjectWithOperator extends ISimpleSemVerObject
{
	operator: string,
}

export interface ISimpleSemVerOperator extends ITSPartialRecord<Exclude<keyof ISimpleSemVerObject, 'operator'>, never>
{
	operator: string,
}

export type ISimpleSemVer = ISimpleSemVerObject | ISimpleSemVerOperator | ISimpleSemVerObjectWithOperator;

export type IHasOperator<T extends ISimpleSemVer> = T & {
	operator: string,
}

