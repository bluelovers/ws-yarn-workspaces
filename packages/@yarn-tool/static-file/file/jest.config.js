// @ts-check

/**
 * @param {string} name
 * @returns {string}
 * @private
 */
function _requireResolve(name)
{
	let result;

	try
	{
		// @ts-ignore
		const { requireResolveExtra, requireResolveCore } = require('@yarn-tool/require-resolve');

		const paths = [
			requireResolveExtra('@bluelovers/tsdx').result,
			requireResolveExtra('tsdx').result,
		].filter(Boolean);

		result = requireResolveCore(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths,
		})
	}
	catch (e)
	{

	}

	result = result || require.resolve(name);

	console.info('[require.resolve]', name, '=>', result)

	return result
}

const testExt = [
	'ts',
	'tsx',
	'mts',
	'cts',
	//'js',
	//'jsx',
//	'mjs',
//	'cjs',
].join('|');

console.info(`jest.config`);
console.info(`- file: ${__filename}`);
console.info(`-  cwd: ${process.cwd()}`);

/**
 * // @type { import('@jest/types').Config.InitialOptions }
 * @type { import('ts-jest').InitialOptionsTsJest }
 */
module.exports = {
	globals: {
		'ts-jest': {
			//tsconfig: 'tsconfig.spec.json',
		},
	},
	maxWorkers: 1,
	clearMocks: true,
	passWithNoTests: true,
	moduleFileExtensions: [
		'ts',
		'tsx',
		'mts',
		'cts',
		'js',
		'jsx',
		'mjs',
		'cjs',
		'json',
		'node',
	],
	testEnvironment: 'node',
	//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
	testMatch: void 0,
	testRegex: [
		`\\.(tests?|spec)\\.(${testExt})$`,
		`__tests__\/\.*\\.(${testExt})$`,
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/__fixtures__/',
		'/fixtures/',
		'/__tests__/helpers/',
		'/__tests__/utils/',
		'__mocks__',
	],
	//testRunner: 'jest-circus/runner',
	setupFilesAfterEnv: [
		//"jest-chain",
		//"jest-extended/all",
		//"jest-extended-extra",
		//"jest-num-close-with",
		/**
		 * https://medium.com/doctolib/how-to-run-the-same-jest-test-suite-across-several-platforms-jest-os-detection-plugin-included-f8113832482b
		 * https://github.com/doctolib/jest-os-detection
		 */
		//'jest-os-detection',
	],
	transform: {
		'.(ts|tsx|mts|cts)$': _requireResolve('ts-jest'),
	},
	verbose: true,
	/**
	 * if didn't set `coverageProvider` to `v8`
	 * with `collectCoverage` `true`, nodejs debug point maybe will fail
	 */
	coverageProvider: 'v8',
	collectCoverage: false,
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/__snapshots__/',
		'/__tests__/',
		//'**/node_modules/',
		//'**/__snapshots__/',
		//'**/__tests__/',
	],
	/**
	 * https://github.com/facebook/jest/issues/9771#issuecomment-872764344
	 */
	//resolver: 'jest-node-exports-resolver',
}
