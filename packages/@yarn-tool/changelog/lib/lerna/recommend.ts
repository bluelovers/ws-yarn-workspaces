import { IListableRow } from 'ws-pkg-list';
import { IType, IOptionsRecommendVersion, IOptionsWithType, IOptionsUpdateChangelog } from '../types';
import { recommendVersion as _recommendVersion } from '@lerna/conventional-commits/lib/recommend-version';
import { handleOptions } from './util';

export function recommendVersion(pkg: IListableRow, options?: IOptionsWithType<IOptionsRecommendVersion>): Promise<string>
{
	options = handleOptions(options)

	return _recommendVersion(pkg, options.type, options)
}

export default recommendVersion
