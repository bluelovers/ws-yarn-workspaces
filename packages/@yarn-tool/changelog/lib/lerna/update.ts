import { IListableRow } from 'ws-pkg-list';
import { IOptionsUpdateChangelog, IOptionsWithType, IReturnTypeUpdateChangelog } from '../types';
import _updateChangelog from '@lerna/conventional-commits/lib/update-changelog';
import { handleOptions } from './util';
import { normalize } from 'upath2';

export function updateChangelog(pkg: IListableRow, options?: IOptionsWithType<IOptionsUpdateChangelog>): Promise<IReturnTypeUpdateChangelog>
{
	options = handleOptions(options)

	let version = options.version ?? pkg.version;
	options.version = version;

	return _updateChangelog({
		...pkg,
		version,
	}, options.type, options)
		.then((data: IReturnTypeUpdateChangelog) => {
			return {
				...data,
				logPath: normalize(data.logPath),
				version,
			}
		})
	;
}

export default updateChangelog
