
export const enum EnumScriptsEntry
{
	JEST_TEST = "jest --passWithNoTests",
	NODE_TEST = "tsx --test --test-update-snapshots test/**/*.node-spec.ts test/**/*.node-test.ts test/**/*.spec.ts test/**/*.test.ts",

	TSC_TEST = "tsc --noEmit & echo typescript check done",

	NO_TEST_SPECIFIED = "echo \"Error: no test specified\"",
	NO_TEST_SPECIFIED_EXIT = "echo \"Error: no test specified\" && exit 1",
	BUILD_DTS_BUNDLE = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle",
	BUILD_DTS_COPY = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts",
	BUILD_DTS_TSC_EMIT = "tsc --emitDeclarationOnly --declaration --noEmit false",
	BUILD_DTS_TSC = "node --run build:dts:tsc:emit & node --run build:dts:copy",

	BUILD_TSDX = "ynpx @bluelovers/tsdx build --target node --name index",
	BUILD_TSDX_AND_DTS = "node --run build:tsdx && node --run build:dts:bundle",

	preversion = "pnpm run test",
}

export function scriptsEntryIsNoTestSpecified(value: string): value is EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT | EnumScriptsEntry.NO_TEST_SPECIFIED
{
	return value === EnumScriptsEntry.NO_TEST_SPECIFIED_EXIT || value === EnumScriptsEntry.NO_TEST_SPECIFIED
}
