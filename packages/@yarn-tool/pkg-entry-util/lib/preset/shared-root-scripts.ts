export function defaultSharedRootScripts()
{
	return {
		"ci:install": "yarn install --frozen-lockfile && yarn add -W typescript@next jest ts-jest ts-node ynpx lerna yarn-tool",
		"test:jest:clearCache": "jest --clearCache",
		"install:resetLockfile": "yarn-tool install --reset-lockfile",
		"install:frozenLockfile": "yarn-tool install --frozen-lockfile",
	}
}
