import {
	ISimpleSemVerObject,
	ISimpleSemVer,
	ISimpleSemVerObjectBase,
	ISimpleSemVerOperator,
	IHasOperator, IOperator,
} from './types';
import { stringifySimpleSemVer } from './stringifySimpleSemVer';
import { pruned, prunedSimpleSemVer } from './util/pruned';
import { hasOperator, isSimpleSemVerOperatorLike, isSimpleSemVerObjectLike } from './checker';

export class SimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer> implements ISimpleSemVerObjectBase
{
	readonly semver: string;
	readonly operator?: IOperator;
	readonly version?: string;
	readonly major?: string;
	readonly minor?: string;
	readonly patch?: string;
	readonly release?: string;
	readonly build?: string;

	constructor(obj: T)
	{
		if (!obj?.semver?.length && !obj?.operator?.length)
		{
			throw new TypeError(`obj not a SimpleSemVerLike`)
		}

		// @ts-ignore
		prunedSimpleSemVer(obj, this)
	}

	isValidOperator(): this is SimpleSemVer<ISimpleSemVerOperator>
	{
		return isSimpleSemVerOperatorLike(this)
	}

	isValidObject(): this is SimpleSemVer<ISimpleSemVerObject>
	{
		return isSimpleSemVerObjectLike(this)
	}

	hasOperator(): this is SimpleSemVer<IHasOperator<T>>
	{
		return hasOperator(this)
	}

	toJSON(): T
	{
		return prunedSimpleSemVer(this as any);
	}

	toString()
	{
		return stringifySimpleSemVer(this as any);
	}

	toFullString()
	{
		return (this.operator ?? '') + this.toString();
	}

}

export default SimpleSemVer
