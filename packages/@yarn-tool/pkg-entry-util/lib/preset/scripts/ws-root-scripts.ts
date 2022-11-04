import { defaultSharedRootScripts } from './shared-root-scripts';
import { EnumScriptsEntry } from '../../field/scripts';

export function _runAllOrSince<T extends string>(script: T)
{
	const all = `${script}:all` as const;
	const since = `${script}:since` as const;

	return {
		[all]: `yarn-tool ws run ${script} --concurrency 1`,
		[since]: `yarn run ${script}:all -- --since`,
	} as ({
		[x in `${T}:all`]: string;
	} & {
		[y in `${T}:since`]: string;
	})
}

export function defaultWorkspaceRootScripts()
{
	return {
		...defaultSharedRootScripts(),

		"test": "yarn run test:since",

		..._runAllOrSince('test'),
		..._runAllOrSince('test:tsd'),
		..._runAllOrSince('test:snapshot'),
		..._runAllOrSince('build'),
		..._runAllOrSince('review'),
		..._runAllOrSince('coverage'),
		..._runAllOrSince('lint'),

		"preversion": EnumScriptsEntry.preversion,
		"postversion": "yarn-tool fix-all",
		"lerna:publish": "yarn run prepublishOnly:root && lerna publish && yarn run postpublishOnly",
		"lerna:publish:yes": "yarn run prepublishOnly:root && lerna publish --yes --bump patch && yarn run postpublishOnly",
		"prepublishOnly:root": "yarn run prepublishOnly:check-bin && yarn run prepare:fix-ws-links",
		"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
		"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
		"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
		"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
		"ncu": "yarn run ncu:ws",
		"ncu:root": "yarn-tool ncu -u",
		"ncu:ws": "yarn-tool ncu -u --AA",
		"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
		"sort-package-json:root": "yarn-tool sort",
		"sort-package-json:ws": "yarn-tool ws sort",
		"postpublishOnly": "yarn run postpublishOnly:ws-root-changelog & echo postpublishOnly",
		"postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git add ./CHANGELOG.md & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
		"tsc:showConfig": "ynpx get-current-tsconfig -p",
	}
}
