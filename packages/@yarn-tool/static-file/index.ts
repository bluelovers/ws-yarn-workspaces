import { existsSync, copySync, CopyOptionsSync, pathExistsSync } from 'fs-extra';
import { resolve } from 'path';

const _defaultCopyStaticFiles = [

	['.npmignore', 'file/npmignore'],
	['.gitignore', 'file/gitignore'],

	['.eslintignore', 'file/eslintignore'],

	['.nvmrc', 'file/nvmrc'],
	['.browserslistrc', 'file/browserslistrc'],

	['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json'],
	['tsconfig.esm.json.tpl', 'file/tsconfig.esm.json.tpl', 'tsconfig.esm.json'],

	['.eslintrc.json.tpl', 'file/eslintrc.json.tpl', '.eslintrc.json'],

	['README.md', 'file/README.md'],

	['.nycrc', 'file/nycrc'],

] as const;

export type IStaticFilesID<T = typeof _defaultCopyStaticFiles> =
	T extends ({
		[n: number]: [infer U, string, string?] | readonly [infer U, string, string?];
	} | {
		readonly [n: number]: [infer U, string, string?] | readonly [infer U, string, string?];
	})
	? U
	: never
	;

export type IStaticFilesRow<K extends string> = [K, string, string?]

type IStaticFilesMap01<K extends string> = {
	[P in K]: IStaticFilesRow<P>
}

export type IStaticFilesMapRecord<K extends string> = {
	[P in K]: string
}

export type IStaticFilesMapArray<K extends string> = IStaticFilesMap01<K>[K][]

export type IStaticFiles<K extends string> = IStaticFilesMapArray<K> | IStaticFilesMapRecord<K>

export const defaultCopyStaticFiles: IStaticFilesMapArray<IStaticFilesID> = Object.freeze(_defaultCopyStaticFiles) as any;

export interface ICopyStaticFilesOptionsBase<K extends string = string>
{
	cwd: string,
	staticRoot?: string,
	overwrite?: boolean,
}

export interface ICopyStaticFilesOptions<K extends string = string> extends ICopyStaticFilesOptionsBase<K>
{
	file_map?: IStaticFiles<K>,
}

export function parseStaticMap<K extends string>(file_map: IStaticFilesMapRecord<K>): [K | IStaticFilesID, string, string?][]
export function parseStaticMap<K extends string>(file_map: IStaticFilesMapArray<K>): [K | IStaticFilesID, string, string?][]
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): [K | IStaticFilesID, string, string?][]
export function parseStaticMap<K extends string>(file_map: IStaticFiles<K>): [K, string, string?][]
{
	let ls: IStaticFilesRow<K>[];

	if (Array.isArray(file_map))
	{
		// @ts-ignore
		ls = Object.values(file_map)
	}
	else
	{
		// @ts-ignore
		ls = Object.entries(file_map)
	}

	return ls
		.filter(v => v && Array.isArray(v) && v.length > 1)
		;
}

export function getStaticFile<K extends string>(file_id: K, options?: Pick<ICopyStaticFilesOptions<string>, 'file_map'>): [K, string, string?]
{
	let ls = parseStaticMap(options && options.file_map || defaultCopyStaticFiles as IStaticFilesMapArray<K>);

	return ls.find(([a]) => {
		return a === file_id;
	}) as [K, string, string?]
}

export function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>)
{
	if (!options.cwd || typeof options.cwd != 'string')
	{
		throw new TypeError(`options.cwd must is string`)
	}

	if (!pathExistsSync(options.cwd))
	{
		throw new TypeError(`options.cwd not exists`)
	}

	let copyOptions: CopyOptionsSync = {
		overwrite: options.overwrite || false,
		preserveTimestamps: true,
		errorOnExist: false,
	};

	const { cwd, file_map = defaultCopyStaticFiles as IStaticFilesMapArray<K> } = options;
	const staticRoot = options.staticRoot || __dirname;

	let ls = parseStaticMap<K>(file_map);

	ls = ls.filter(v => v && Array.isArray(v) && v.length > 1);

	if (!ls.length)
	{
		throw new TypeError(`file_map is not file map`)
	}

	return ls
		.filter(function ([a, b, c]: IStaticFilesRow<K>)
		{
			let fa = resolve(cwd, a);
			let fb = resolve(staticRoot, b);

			if (c != null)
			{
				let fc = resolve(cwd, c);

				if (existsSync(fc))
				{
					return;
				}
			}

			if (!existsSync(fb))
			{
				throw new Error(`file not exists. ${fb}`)
			}

			copySync(fb, fa, copyOptions);

			return true;
		})
	;
}

export default copyStaticFiles
