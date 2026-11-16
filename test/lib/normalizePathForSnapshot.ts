import upath2 from 'upath2';
import { tmpdir } from 'node:os';
import { __ROOT_WS } from '../../__root_ws';

export function _isPathForSnapshot(path: string)
{
	return typeof path === 'string' && /node_modules|fnm_multishells|node_modules|ws-yarn-workspaces/.test(path);
}

export function _normalizePathForSnapshot(path: string, name?: string)
{
	if (!path?.length)
	{
		return path;
	}

	path = upath2.normalize(path);

	if (name?.length)
	{
		path = path
			.replace(new RegExp(`^.+installation\\/node_modules\\/(?=${name})`, 'g'), '<global/node_modules>/')
			.replace(new RegExp(`^.+node_modules\\/(?=${name})`, 'g'), '<node_modules>/')
		;
	}

	path = path
		.replace(upath2.normalize(tmpdir()), '<tmpdir>')
		.replace(/^.+fnm_multishells\/[\w_]+/, '<fnm>')
		.replace(/^.+ws-yarn-workspaces\//, '<ws-yarn-workspaces>/')
		.replace(__ROOT_WS, '<ws-yarn-workspaces>')
	;

	return path;
}
