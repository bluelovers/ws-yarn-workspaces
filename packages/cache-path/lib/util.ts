import { defaultOrder, findPkgModuleCachePath } from './finder';
import { array_unique_overwrite } from 'array-hyper-unique/index';
import { findPkgModulePath, findPkgPath } from './finder/findPkgModuleCachePath';
import { existsSync } from "fs";
import { ensureDirSync } from 'fs-extra';
import { isWritableDirectorySync } from '@lazy-node/is-writeable-path/index';
import { resolve } from "upath2";
import { IOptions } from './types';

export function handleOptions(options?: IOptions | string): IOptions
{
	if (typeof options === 'string')
	{
		options = {
			cwd: options,
		}
	}

	options ??= {};

	let {
		cwd = process.cwd(),
		fnOrder = defaultOrder,
	} = options;

	if (!options.disableDefaultFailback && options.fnOrder && fnOrder !== defaultOrder)
	{
		// @ts-ignore
		fnOrder = fnOrder.concat(defaultOrder);

		array_unique_overwrite(fnOrder);
	}

	options.cwd = resolve(cwd);
	options.fnOrder = fnOrder;
	options.processEnv ??= process.env;
	options.create = !!options.create;

	return options
}

export function _createAble(options: IOptions, fn)
{
	return (options?.create === true || fn === findPkgModuleCachePath || fn === findPkgModulePath || fn === findPkgPath)
}

export function _check(dir: string, options: IOptions)
{
	if (!dir?.length)
	{
		throw new Error(`can't found cache path`)
	}
	else if (typeof dir !== 'string')
	{
		throw new Error(`not a path '${dir}'`)
	}
	else if (!existsSync(dir))
	{
		if (options.create)
		{
			ensureDirSync(dir)
		}
		else
		{
			throw new Error(`path not exists '${dir}'`)
		}
	}

	if (!isWritableDirectorySync(dir))
	{
		throw new Error(`path is not writeable '${dir}'`)
	}

	return true
}
