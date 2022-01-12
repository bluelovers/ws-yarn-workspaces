import { defaultSharedRootScripts } from './shared-root-scripts';

export function defaultRootScripts()
{
	return {
		...defaultSharedRootScripts(),
		"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
		"version:bump": "yarn-tool version",
		"npm:publish": "npm publish",
		"npm:publish:bump": "yarn run version:bump && npm publish",
		"postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
		"postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
		"postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
		"postpublish:git:push": `git push --follow-tags`,
		"postpublish": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,
	}
}
