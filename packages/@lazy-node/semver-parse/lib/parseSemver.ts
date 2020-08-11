import { reSemver } from './const';
import { SimpleSemVer } from './SimpleSemVer';
import { pruned } from './util/pruned';

export function parseSemver(version: string)
{
	// semver, major, minor, patch
	// https://github.com/mojombo/semver/issues/32
	// https://github.com/isaacs/node-semver/issues/10
	// optional v
	const m = reSemver.exec(version) || []
	;let ver = new SimpleSemVer(pruned({
		semver: m[0]
		, version: m[1]
		, major: m[2]
		, minor: m[3]
		, patch: m[4]
		, release: m[5]
		, build: m[6],
	}))
;

	if (0 === m.length)
	{
		ver = null;
	}

	return ver;
}
