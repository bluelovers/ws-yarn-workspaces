import { reSemver, reSemverWithRange } from './const';
import { SimpleSemVer } from './SimpleSemVer';
import { pruned } from './util/pruned';
import { ISimpleSemVer } from './types';

export function parseSimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer>(version: string)
{
	// semver, major, minor, patch
	// https://github.com/mojombo/semver/issues/32
	// https://github.com/isaacs/node-semver/issues/10
	// optional v
	const m = reSemverWithRange.exec(version);
	let ver: SimpleSemVer;

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
		})
	}

	return ver;
}

export default parseSimpleSemVer
