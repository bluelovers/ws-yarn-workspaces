/**
 * Created by user on 2020/6/5.
 */

import { join } from 'upath2';

export function getModulesDir(cwd: string, dir?: string)
{
	return join(cwd, dir ?? 'node_modules')
}
