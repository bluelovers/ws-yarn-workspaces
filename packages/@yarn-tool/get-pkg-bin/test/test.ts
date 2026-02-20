/**
 * Created by user on 2020/2/16.
 */

import { normalizePackageBins} from '../index';
import { resolvePackage } from '@yarn-tool/resolve-package';

const _ts_node = resolvePackage('ts-node', {
	includeGlobal: true,
});

let bins = normalizePackageBins({
	..._ts_node,
});

console.dir(bins)

bins = normalizePackageBins({
	..._ts_node,

	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	//pkgRoot: dirname(require.resolve('ts-node/package.json')),
	pkg: _ts_node.pkg,
	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	name: 'ts-node',
	usePathResolve: true,
	includeGlobal: true,
});

console.dir(bins)
