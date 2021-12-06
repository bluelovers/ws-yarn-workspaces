import { IPackageJson } from '@ts-type/package-dts/package-json';

export function updatePackageJson<P extends IPackageJson>(pkg: P)
{
	pkg.scripts ??= {};

	pkg.scripts["posttest"] ??= "yarn run build";
	pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts";
	pkg.scripts["build:dts"] ??= "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner & echo build:dts";
	pkg.scripts["build:tsdx"] ??= "ynpx @bluelovers/tsdx build --target node --name index";

	pkg.main = "dist/index.cjs";
	pkg.module = "dist/index.esm.mjs";
	pkg.types = pkg.typings = "dist/index.d.ts";

	pkg.exports ??= {};
	pkg.exports['.'] ??= {};
	pkg.exports['.'].types = "./dist/index.d.ts";
	pkg.exports['.'].import = "./dist/index.esm.mjs";
	pkg.exports['.'].require = "./dist/index.cjs";

	pkg.keywords ??= [];
	pkg.keywords.push('create-by-tsdx');

	return pkg
}

export function setup<P extends IPackageJson>(config: {
	pkg: P,

})
{
	let { pkg } = config;

	pkg = updatePackageJson(pkg);

	return {
		pkg,
	}
}
