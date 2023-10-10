import { npmCheckUpdates } from '@yarn-tool/ncu';
import { readJSON } from 'fs-extra';
import { __ROOT } from '../__root';
import { join } from 'upath2';
import { writePackageJSON } from '@yarn-tool/write-package-json';
import { sortPackageJson } from 'sort-package-json3';

const file = join(__ROOT, 'lib/package.demo.json');

export default readJSON(file)
	.then(json_old => npmCheckUpdates({}, {
		json_old,
	}))
	.then(data => data.json_new)
	.then(sortPackageJson)
	.then(json_new => writePackageJSON(file, json_new))
	.then(() => console.log(`updated`, 'package.demo.json'))
