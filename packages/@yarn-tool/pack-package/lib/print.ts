/**
 * Created by user on 2020/4/9.
 */

import logPacked from '@lerna/log-packed';
import { IPackedTarballInfo } from './types';

export function printPackedTarballInfo(tarball: IPackedTarballInfo): void
{
	return logPacked(tarball)
}

export default printPackedTarballInfo
