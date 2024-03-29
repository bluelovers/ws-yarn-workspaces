import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { _Key, IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
import { EnumScriptsEntry, scriptsEntryIsNoTestSpecified } from '@yarn-tool/pkg-entry-util/lib/field/scripts';
import { deleteValue } from 'dot-values2';
import { EnumTsdx } from './const';
import { fixTsdxPackage } from './fix';
import { ensureDirSync } from 'fs-extra';
import { resolve } from 'path';

export function updatePackageJson<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>)
{
	pkg.scripts ??= {};

	if (scriptsEntryIsNoTestSpecified(pkg.scripts["test"]))
	{
		pkg.scripts["test"] = void 0;
	}

	pkg.scripts["test"] ??= EnumScriptsEntry.JEST_TEST;

	pkg.scripts["posttest"] ??= "yarn run build";

	if (!pkg.scripts["build"]?.includes('run build:tsdx'))
	{
		pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
	}

	pkg.scripts["build:dts:bundle"] ??= EnumScriptsEntry.BUILD_DTS_BUNDLE;
	pkg.scripts["build:tsdx"] ??= "ynpx @bluelovers/tsdx build --target node";

	pkg.scripts["build:dts:copy"] ??= "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts";
	pkg.scripts["build:dts:tsc:emit"] ??= "tsc --emitDeclarationOnly --declaration --noEmit false";
	pkg.scripts["build:dts:tsc"] ??= [
    'yarn run build:dts:copy',
    'yarn run build:dts:tsc:emit',
    'yarn run build:dts:copy',
  ].join(' && ');

	pkg.main = "dist/index.cjs";
	pkg.module = "dist/index.esm.mjs";
	pkg.types = pkg.typings = "dist/index.d.ts";
	pkg.unpkg ??= "dist/index.umd.production.min.cjs";

	pkg.exports ??= {};
	pkg.exports['.'] ??= {};
	pkg.exports['.'].types = "./dist/index.d.ts";
	pkg.exports['.'].import = "./dist/index.esm.mjs";
	pkg.exports['.'].require = "./dist/index.cjs";

	pkg.exports['./src/*'] = './src/*';
	pkg.exports['./package.json'] ??= './package.json';

	pkg.keywords ??= [];
	if (!pkg.keywords.includes(EnumTsdx.keyword))
	{
		pkg.keywords.push(EnumTsdx.keyword);
	}

	fixTsdxPackage(pkg, config);

	return pkg
}

const _defaultCopyStaticFilesTsdx = [

	['tsconfig.json', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.json'],
	['test/tsconfig.json', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
	['src/index.cts', 'file/tsdx/index.cts'],

] as const;

export const defaultCopyStaticFilesTsdx = Object.freeze(_defaultCopyStaticFilesTsdx) as any as IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesTsdx>>;

export interface ISetupTsdxOptions<P extends IPackageJson>
{
	targetDir: string,
	pkg: P,
	rootData: IFindRootReturnType,
	file_map: IStaticFilesMapArray<string>,
	mdFile: string,
	existsReadme: boolean,
	oldExists: boolean,
}

export function setup<P extends IPackageJson>(config: ISetupTsdxOptions<P>)
{
	let {
		pkg,
		file_map,
		targetDir,
	} = config;

	pkg = updatePackageJson(pkg, config);

	file_map = [
    ...defaultCopyStaticFilesTsdx,
		...file_map,
	];

	ensureDirSync(resolve(targetDir, 'src'));

	return {
		...config,
		pkg,
		file_map,
	}
}
