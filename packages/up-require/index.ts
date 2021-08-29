/// <reference types="node" />

const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND' as const;

export { MODULE_NOT_FOUND }

export interface IErrnoException extends NodeJS.ErrnoException, Error
{
	code?: string | typeof MODULE_NOT_FOUND,
	module?: NodeModule,
	startModule?: NodeModule,
	/**
	 * all module list for search
	 */
	list?: NodeModule[],
}

/**
 * Require package module from highest module.
 */
export function requireFromTopParent<T = any>(id: string, startModule?: NodeModule)
{
	let ls = getAllModule(startModule);

	return requireFromModuleList<T>(id, ls, ls[0]);
}

/**
 * get all module and parents by start module
 */
export function getAllModule(startModule: NodeModule = module.parent): NodeModule[]
{
	if (!startModule || typeof startModule !== 'object')
	{
		throw new TypeError(`startModule is not valid`);
	}

	let pm = startModule;
	let ls: NodeModule[] = [];

	do
	{
		ls.push(pm);
	}
	while (pm = pm.parent);

	return ls;
}

/**
 * Require module from module list
 * (order is desc, from last one to first one)
 */
export function requireFromModuleList<T = any>(id: string, ls: NodeModule[], startModule: NodeModule): T
{
	if (typeof startModule === 'undefined')
	{
		startModule = ls[0]
	}

	let pm: NodeModule;
	let err: IErrnoException;
	let tm: NodeModule;

	let i = ls.length;

	while (i > 0)
	{
		tm = ls[--i];

		try
		{
			pm = tm;
			return pm.require(id);
		}
		catch (e)
		{
			err = e;
		}
	}

	err = _createError(err, {
		id,
		module: pm,
		startModule,
		list: ls,
	});

	throw err;
}

/**
 * @alias requireFromTopParent
 */
export function upRequire<T = any>(id: string, startModule?: NodeModule)
{
	return requireFromTopParent<T>(id, startModule);
}

/**
 * @alias requireFromTopParent
 */
export function requireUp<T = any>(id: string, startModule?: NodeModule)
{
	return requireFromTopParent<T>(id, startModule);
}

/**
 * Require package module by parent module require.
 */
export function requireParent<T = any>(id: string, startModule: NodeModule): T
{
	if (!startModule || typeof startModule !== 'object')
	{
		throw new TypeError(`startModule is not valid`);
	}

	return startModule.parent.require(id);
}

/**
 * Require package module start from parent module.
 */
export function requireFromParentUp<T = any>(id: string, startModule?: NodeModule)
{
	let ls = getAllModule(startModule);
	startModule = ls.shift();

	return requireFromModuleList<T>(id, ls.reverse(), startModule);
}

/**
 * normalize Error data for debug
 */
export function _createError(err: IErrnoException, data: {
	id?: string,
	code?: string | typeof MODULE_NOT_FOUND
	module?: NodeModule,
	startModule?: NodeModule,
	list?: NodeModule[],
}): IErrnoException
{
	let msg = `Cannot find module '${data.id}'`;

	if (!err)
	{
		err = new Error(msg);
		err.code = data.code || MODULE_NOT_FOUND;

		Error.captureStackTrace(err, _createError)
	}
	else
	{
		//err.message = msg;
	}

	err.startModule = data.startModule;
	err.module = data.module;
	err.list = data.list;

	return err;
}

/**
 * find module by exports
 */
export function getModuleByExports<T = any>(exportModule: T, req = require): INodeModule<T>
{
	let ks = Object.keys(req.cache);

	let i = ks.length;

	while (--i)
	{
		let key = ks[i];
		let mod: NodeModule = req.cache[key];

		if (mod.exports === exportModule)
		{
			return mod;
		}
	}

	return null;
}

/**
 * find module by full file path
 */
export function getModuleByFile<T = any>(file: string, requireIfNotExists?: boolean, req = require): INodeModule<T>
{
	let cache = getRequireCache(req);
	let ks = Object.keys(cache);

	let i = ks.length;

	while (--i)
	{
		let key = ks[i];
		let mod = cache[key];

		if (mod.filename === file)
		{
			return mod;
		}
	}

	if (requireIfNotExists)
	{
		try
		{
			req(file);

			return getModuleByFile(file, false, req);
		}
		catch (e)
		{

		}
	}

	return null;
}

export interface INodeRequireCache
{
	[k: string]: NodeModule
}

/**
 * return require.cache for typescript
 */
export function getRequireCache(req = require): INodeRequireCache
{
	return req.cache
}

export interface INodeModule<T = any> extends NodeModule
{
	exports: T;
	require: NodeRequire;
	id: string;
	filename: string;
	loaded: boolean;
	parent: NodeModule | null;
	children: NodeModule[];
	paths: string[];
}

/**
 * get main module
 */
export function getMainModule<T = any>(id = '.'): INodeModule<T>
{
	let pm = module;

	do
	{
		if (pm.id === id)
		{
			return pm;
		}
	}
	while (pm = pm.parent);

	return null;
}

/**
 * get module by package id like require(id)
 */
export function getModuleByID<T = any>(id: string, requireIfNotExists?: boolean, req = require)
{
	if (id === '.')
	{
		return getMainModule<T>(id);
	}

	return getModuleByFile<T>(req.resolve(id), requireIfNotExists, req);
}

export default requireFromTopParent
