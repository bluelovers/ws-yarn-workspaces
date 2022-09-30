export function defaultSharedRootScripts()
{
	return {
		"ci:install": `yarn install --frozen-lockfile && yarn add -W ${[
			"yarn-tool",
			"lerna",
			"ynpx",
			"ts-node",
			"ts-jest",
			"jest",
			"typescript@next",
      '@bluelovers/jest-config',
		].join(" ")}`,
		"test:jest:clearCache": "jest --clearCache",
		"install:resetLockfile": "yarn-tool install --reset-lockfile",
		"install:frozenLockfile": "yarn-tool install --frozen-lockfile",
    "ws:fix-all": "yarn-tool fix-all  --overwriteHostedGitInfo",
    "ws:fix-all:resetStaticFiles": "yarn run ws:fix-all -- --resetStaticFiles",
	}
}