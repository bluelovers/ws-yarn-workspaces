/**
 * Created by user on 2020/2/16.
 */

import { normalizePackageBins} from '../index';
import { resolvePackage } from '@yarn-tool/resolve-package';

let bins = normalizePackageBins({
	...resolvePackage('ts-node'),
});

console.dir(bins)

bins = normalizePackageBins({
	...resolvePackage('ts-node'),

	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	//pkgRoot: dirname(require.resolve('ts-node/package.json')),
	pkg: resolvePackage('ts-node').pkg,
	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	name: 'ts-node',
});

console.dir(bins)
