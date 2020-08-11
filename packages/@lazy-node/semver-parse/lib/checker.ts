import {
	ISimpleSemVer,
	ISimpleSemVerOperator,
	ISimpleSemVerObject,
	IHasOperator,
	ISimpleSemVerObjectBase,
} from './types';

export function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is Extract<T, ISimpleSemVerOperator>
{
	return (!obj.major?.length && obj.operator?.length > 0)
}

export function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is Extract<T, ISimpleSemVerObject>
{
	return obj.major?.length > 0
}

export function hasOperator<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T>
{
	return obj.operator?.length > 0
}
