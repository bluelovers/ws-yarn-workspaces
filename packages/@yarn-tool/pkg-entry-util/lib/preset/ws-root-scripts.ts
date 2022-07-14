import { defaultSharedRootScripts } from './shared-root-scripts';

export function defaultWorkspaceRootScripts()
{
	return {
		...defaultSharedRootScripts(),
		"test:all": "yarn-tool ws run test --concurrency 1",
		"test:since": "yarn run test:all -- --since",
		"build:all": "yarn-tool ws run build --concurrency 1",
		"review:all": "yarn-tool ws run review --concurrency 1",
		"coverage:all": "yarn-tool ws run coverage --concurrency 1",
		"lint:all": "yarn-tool ws run lint --concurrency 1",
		"preversion": "yt ws run test",
		"postversion": "yt fix-all",
		"lerna:publish": "yarn run prepublishOnly:root && lerna publish && yarn run postpublishOnly",
		"lerna:publish:yes": "yarn run prepublishOnly:root && lerna publish --yes --bump patch && yarn run postpublishOnly",
		"prepublishOnly:root": "yarn run prepublishOnly:check-bin && yarn run prepare:fix-ws-links",
		"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
		"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
		"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
		"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
		"ncu": "yarn run ncu:root && yarn run ncu:ws",
		"ncu:root": "yarn-tool ncu -u",
		"ncu:ws": "yarn-tool ws exec yarn-tool ncu -- -u",
		"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
		"sort-package-json:root": "yarn-tool sort",
		"sort-package-json:ws": "yarn-tool ws sort",
		"postpublishOnly": "yarn run postpublishOnly:ws-root-changelog & echo postpublishOnly",
		"postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git add ./CHANGELOG.md & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
		"test": "yarn run test:since",
		"install:reset-lockfile": "yarn-tool install --reset-lockfile",
		"ws:fix-all":"yarn-tool fix-all  --overwriteHostedGitInfo",
		"tsc:showConfig": "ynpx get-current-tsconfig -p",
	}
}
