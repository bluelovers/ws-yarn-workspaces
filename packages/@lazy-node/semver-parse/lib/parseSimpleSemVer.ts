import { reSemver, reSemverWithRange } from './const';
import { SimpleSemVer } from './SimpleSemVer';
import { pruned } from './util/pruned';
import { ISimpleSemVer, ISimpleSemVerObject, IToSimpleSemVerObject } from './types';
import { assertSimpleSemVerObjectLike } from './checker';

export function parseSimpleSemVer<T extends ISimpleSemVerObject = ISimpleSemVerObject>(version: string): IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>
{
	// semver, major, minor, patch
	// https://github.com/mojombo/semver/issues/32
	// https://github.com/isaacs/node-semver/issues/10
	// optional v
	const m = reSemverWithRange.exec(version);
	let ver: IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>;

	if (m?.length > 0)
	{
		let [semver, operator, version, major, minor, patch, release, build] = m;

		ver = new SimpleSemVer({
			operator,
			semver,
			version,
			major,
			minor,
			patch,
			release,
			build,
		}) as any

		assertSimpleSemVerObjectLike(ver);
	}

	return ver;
}

export default parseSimpleSemVer
