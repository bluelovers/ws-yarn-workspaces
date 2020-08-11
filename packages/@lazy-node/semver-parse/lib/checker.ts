import {
	ISimpleSemVer,
	ISimpleSemVerOperator,
	ISimpleSemVerObject,
	IHasOperator,
	ISimpleSemVerObjectBase,
} from './types';

export function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T> & {
	major?: never,
}
{
	return (!obj.major?.length && obj.operator?.length > 0)
}

export function assertSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IHasOperator<T> & {
	major?: never,
}
{
	if (notThrow !== true && !isSimpleSemVerOperatorLike(obj))
	{
		throw new TypeError(`obj not a SimpleSemVerOperator`)
	}
}

export function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is T & {
	major: string
}
{
	return obj.major?.length > 0
}

export function assertSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is T & {
	major: string
}
{
	if (notThrow !== true && !isSimpleSemVerObjectLike(obj))
	{
		throw new TypeError(`obj not a SimpleSemVerObject`)
	}
}

export function hasOperator<T extends ISimpleSemVerObjectBase>(obj: T): obj is IHasOperator<T>
{
	return obj.operator?.length > 0
}

export function assertHasOperator<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IHasOperator<T>
{
	if (notThrow !== true && !hasOperator(obj))
	{
		throw new TypeError(`obj not has operator`)
	}
}
