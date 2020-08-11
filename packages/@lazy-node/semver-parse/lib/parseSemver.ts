import { reSemver } from './const';
import { SimpleSemVer } from './SimpleSemVer';
import { pruned } from './util/pruned';

export function parseSemver(version: string)
{
	// semver, major, minor, patch
	// https://github.com/mojombo/semver/issues/32
	// https://github.com/isaacs/node-semver/issues/10
	// optional v
	const m = reSemver.exec(version);
	let ver: SimpleSemVer;

	if (m?.length > 0)
	{
		ver = new SimpleSemVer({
			semver: m[0]
			, version: m[1]
			, major: m[2]
			, minor: m[3]
			, patch: m[4]
			, release: m[5]
			, build: m[6],
		})
	}

	return ver;
}

export default parseSemver
