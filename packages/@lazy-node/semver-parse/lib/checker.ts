import {
	ISimpleSemVer,
	ISimpleSemVerOperator,
	ISimpleSemVerObject,
	IHasOperator,
	ISimpleSemVerObjectBase,
	IToSimpleSemVerOperator,
	IToSimpleSemVerObject,
	IToSimpleSemVerObjectWithOperator,
	IToSimpleSemVerObjectOrOperator,
} from './types';

export function isSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerOperator<T>
{
	return !isSimpleSemVerObjectLike(obj) && hasOperator(obj)
}

export function assertSimpleSemVerOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerOperator<T>
{
	if (notThrow !== true && !isSimpleSemVerOperatorLike(obj))
	{
		throw new TypeError(`obj not a SimpleSemVerOperator`)
	}
}

export function isSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObject<T>
{
	return obj.major?.length > 0
}

export function assertSimpleSemVerObjectLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObject<T>
{
	if (notThrow !== true && !isSimpleSemVerObjectLike(obj))
	{
		throw new TypeError(`obj not a SimpleSemVerObject`)
	}
}

export function isSimpleSemVerObjectWithOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObjectWithOperator<T>
{
	return isSimpleSemVerObjectLike(obj) && hasOperator(obj)
}

export function assertSimpleSemVerObjectWithOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObjectWithOperator<T>
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

export function isSimpleSemVerObjectOrOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T): obj is IToSimpleSemVerObjectOrOperator<T>
{
	return isSimpleSemVerObjectLike(obj) || hasOperator(obj)
}

export function assertSimpleSemVerObjectOrOperatorLike<T extends ISimpleSemVerObjectBase>(obj: T, notThrow?: boolean): asserts obj is IToSimpleSemVerObjectOrOperator<T>
{
	if (notThrow !== true && !isSimpleSemVerObjectOrOperatorLike(obj))
	{
		throw new TypeError(`obj not a SimpleSemVerObject or SimpleSemVerOperator`)
	}
}
