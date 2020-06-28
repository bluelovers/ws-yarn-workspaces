

import { wsPkgDepsListableRecord } from 'ws-pkg-list';
import wsChanged from '../index';
import { findUpDepsAllDeep } from '@yarn-tool/find-deps';

export default (async () => {

	let cwd = `G:\\Users\\The Project\\nodejs-yarn\\ws-regexp`

	let record = wsPkgDepsListableRecord(cwd)

	const listChanged = wsChanged(cwd)

	console.dir(listChanged)

	let list = listChanged.changed.concat(listChanged.staged).map(row => row.name)

	console.dir(findUpDepsAllDeep(list, record))

})();
