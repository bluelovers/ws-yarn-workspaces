// @ts-check

/**
 * // @type { import('@jest/types').Config.InitialOptions }
 * @type { import('ts-jest').InitialOptionsTsJest }
 */
const jestConfig = {

}

try
{
	if (!jestConfig.preset)
	{
		let result = require('@yarn-tool/ws-find-up-paths').findUpPathsWorkspaces('jest.config.js', {
			ignoreCurrentPackage: true,
		});
		if (result)
		{
			jestConfig.preset = result;
		}
	}
}
catch (e)
{

}

try
{
	if (!jestConfig.preset)
	{
		let result = require.resolve('@bluelovers/jest-config');
		if (result)
		{
			jestConfig.preset = result;
		}
	}
}
catch (e)
{

}

if (!jestConfig.preset)
{
	jestConfig.preset = '@bluelovers/jest-config';
}

module.exports = jestConfig
