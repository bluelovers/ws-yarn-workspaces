import { ISimpleSemVerObject, ISimpleSemVer } from './types';
import { stringifySemver } from './stringifySemver';
import { pruned } from './util/pruned';

export class SimpleSemVer implements ISimpleSemVerObject
{
	operator?: string;
	semver: string;
	major: string;
	minor?: string;
	patch?: string;
	release?: string;
	build?: string;

	constructor(obj: ISimpleSemVer)
	{
		Object.keys(obj).forEach((key) =>
		{
			this[key] = obj[key];
		});
	}

	toString()
	{
		return stringifySemver(this);
	}
}
