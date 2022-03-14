import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { _Key, IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';

export function updatePackageJson<P extends IPackageJson>(pkg: P)
{
	pkg.scripts ??= {};

	pkg.scripts["posttest"] ??= "yarn run build";

	if (!pkg.scripts["build"]?.includes('run build:tsdx'))
	{
		pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
	}

	pkg.scripts["build:dts:bundle"] ??= "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle";
	pkg.scripts["build:tsdx"] ??= "ynpx @bluelovers/tsdx build --target node --name index";

	pkg.scripts["build:dts:copy"] ??= "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts";
	pkg.scripts["build:dts:tsc:emit"] ??= "tsc --emitDeclarationOnly --declaration --noEmit false";
	pkg.scripts["build:dts:tsc"] ??= "yarn run build:dts:tsc:emit && yarn run build:dts:copy";

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
	pkg.keywords.push('create-by-tsdx');

	return pkg
}

const _defaultCopyStaticFilesTsdx = [

	['tsconfig.json', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.json'],
	['test/tsconfig.json', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],

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
	} = config;

	pkg = updatePackageJson(pkg);

	file_map = [
		...defaultCopyStaticFilesTsdx,
		...file_map,
	];

	return {
		...config,
		pkg,
		file_map,
	}
}
