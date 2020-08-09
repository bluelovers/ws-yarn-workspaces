import { ensureDirSync, ensureDir } from 'fs-extra';
import { resolve } from "upath2";
import Bluebird from 'bluebird';
import { isWritableDirectorySync, isWritableDirectoryAsync } from '@lazy-node/is-writeable-path/index';
import { _check, _createAble, handleOptions } from './util';
import { IOptions } from './types';

export function getCacheRoot(_options?: IOptions | string): string
{
	let options = handleOptions(_options);

	let { processEnv, cwd } = options;

	let dir: string;

	options.fnOrder.some(function (fn)
	{
		// @ts-ignore
		dir = fn(cwd, processEnv);

		if (dir?.length)
		{
			if (_createAble(options, fn))
			{
				try
				{
					ensureDirSync(dir);
				}
				catch (err)
				{}
			}

			return isWritableDirectorySync(dir)
		}
	});

	_check(dir, options);

	return resolve(dir)
}

export function getCacheRootAsync(options?: IOptions | string): Bluebird<string>
{
	return Bluebird.resolve(handleOptions(options))
		.then(async function (options)
		{
			let { processEnv, cwd } = options;

			let dir: string;

			for (let fn of options.fnOrder)
			{
				// @ts-ignore
				dir = await fn(cwd, processEnv);

				if (dir?.length)
				{
					if (_createAble(options, fn))
					{
						try
						{
							await ensureDir(dir);
						}
						catch (err)
						{}
					}

					if (await isWritableDirectoryAsync(dir))
					{
						break;
					}
				}
			}

			_check(dir, options);

			return resolve(dir)
		})
		;
}
