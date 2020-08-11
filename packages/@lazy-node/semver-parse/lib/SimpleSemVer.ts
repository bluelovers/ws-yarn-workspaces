import {
	ISimpleSemVerObject,
	ISimpleSemVer,
	ISimpleSemVerObjectBase,
	ISimpleSemVerOperator,
	IHasOperator, IOperator, IToSimpleSemVerObject, IToSimpleSemVerOperator, IToSimpleSemVerObjectOrOperator,
} from './types';
import { stringifySimpleSemVer } from './stringifySimpleSemVer';
import { pruned, prunedSimpleSemVer } from './util/pruned';
import {
	hasOperator,
	isSimpleSemVerOperatorLike,
	isSimpleSemVerObjectLike,
	assertSimpleSemVerObjectOrOperatorLike, isSimpleSemVerObjectOrOperatorLike,
} from './checker';
import parseSimpleSemVer from './parseSimpleSemVer';

export class SimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer> implements ISimpleSemVerObjectBase
{
	readonly semver?: string;
	readonly operator?: IOperator;
	readonly version?: string;
	readonly major?: string;
	readonly minor?: string;
	readonly patch?: string;
	readonly release?: string;
	readonly build?: string;

	constructor(obj: T)
	{
		assertSimpleSemVerObjectOrOperatorLike(obj);

		// @ts-ignore
		prunedSimpleSemVer(obj, this as any)
	}

	static create<T extends ISimpleSemVer = ISimpleSemVer>(version: string)
	{
		return new this<T>(parseSimpleSemVer(version) as any) as IToSimpleSemVerObjectOrOperator<SimpleSemVer<T>>
	}

	isValid(): this is IToSimpleSemVerObjectOrOperator<SimpleSemVer<IToSimpleSemVerObjectOrOperator<T>>>
	{
		return isSimpleSemVerObjectOrOperatorLike(this)
	}

	isValidOperator(): this is IToSimpleSemVerOperator<SimpleSemVer<IToSimpleSemVerOperator<T>>>
	{
		return isSimpleSemVerOperatorLike(this)
	}

	isValidObject(): this is IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>
	{
		return isSimpleSemVerObjectLike(this)
	}

	hasOperator(): this is IHasOperator<SimpleSemVer<IHasOperator<T>>>
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
