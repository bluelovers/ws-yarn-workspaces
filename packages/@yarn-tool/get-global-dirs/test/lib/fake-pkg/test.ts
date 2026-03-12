/**
 * Created by user on 2026/3/12.
 */

import { globalDirectory as _self } from '@yarn-tool/get-global-dirs';
import _sindresorhus_global_directory from 'global-directory';
import _sindresorhus_global_dirs from 'global-dirs';
import { equal, deepEqual } from 'assert';

export function _test()
{
	const ret = {
		['get-global-dirs']: _self,
		['global-directory']: _sindresorhus_global_directory,
		['global-dirs']: _sindresorhus_global_dirs,
	} as const;

	console.dir(ret);

	return ret
}

export function _check()
{
	let result = _test()

	deepEqual(result['get-global-dirs'], result['global-directory']);
}

_check()
