import { IPackageJson } from '@ts-type/package-dts/package-json';

export function updatePackageJson<P extends IPackageJson>(pkg: P)
{
	pkg.scripts ??= {};

	pkg.scripts["posttest"] ??= "yarn run build";
	pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts";
	pkg.scripts["build:dts"] ??= "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --external-inlines ts-type & echo build:dts";
	pkg.scripts["build:tsdx"] ??= "tsdx build --target node --name index";

	pkg.main = "dist/index.js";
	pkg.module = "dist/index.esm.js";
	pkg.types = pkg.typings = "dist/index.d.ts";

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
