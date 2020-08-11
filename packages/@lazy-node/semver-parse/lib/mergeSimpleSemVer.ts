/**
 * Created by user on 2020/8/12.
 */
import { ISimpleSemVer, ISimpleSemVerObjectBase } from './types';
import { assertSimpleSemVerObjectLike, assertSimpleSemVerObjectOrOperatorLike } from './checker';
import { isAllowedMergeAbleValue } from './util/isAllowedMergeAbleValue';
import parseSimpleSemVer from './parseSimpleSemVer';
import { ITSRequiredWith, ITSPickExtra, ITSPartialRecord, ITSRequiredPick, ITSPartialPick  } from 'ts-type/lib/type/record';

export function mergeSimpleSemVer<T extends ISimpleSemVer>(target: T, b: ISimpleSemVerObjectBase)
{
	assertSimpleSemVerObjectLike(target);
	assertSimpleSemVerObjectOrOperatorLike(b);

	let changed: ITSPartialPick<ISimpleSemVerObjectBase, 'major'|'minor'|'patch'>;

	([
		'major',
		'minor',
		'patch',
	] as (keyof typeof changed)[]).forEach(key => {

		let value1: string = target[key];
		let value2: string = b[key];

		if (isAllowedMergeAbleValue(value1) && isAllowedMergeAbleValue(value2))
		{
			changed ??= {};

			target[key] = value2;

			changed[key] = value2;
		}
	});

	return {
		target,
		changed,
	}
}

