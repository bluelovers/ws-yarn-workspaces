import { defaultSharedRootScripts } from './shared-root-scripts';
import { defaultPkgScripts } from './pkg-scripts';

export function defaultRootScripts()
{
	const bumpVersion = (bump?: 'major' | 'minor' | 'patch' | 'prerelease') =>
	{
		return [
			`yarn run version:bump` + (bump ? `:${bump}` : ''),
			`npm publish`,
		].join(' && ')
	}

	return {
		...defaultPkgScripts(),
		...defaultSharedRootScripts(),
		"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
		"version:bump": "yarn-tool version",
		"npm:publish": "npm publish",
		//"npm:publish:bump": "yarn run version:bump && npm publish",
		"npm:publish:bump": bumpVersion(),

		...([
			'patch',
			'minor',
			'major',
			'prerelease',
		] as const).reduce((a, bump, idx) =>
		{
			a[`version:bump:${bump}`] = `yarn run version:bump` + (bump ? ` -- --bump ${bump}` : '');
			a[`npm:publish:bump:${bump}`] = bumpVersion(bump);
			return a
		}, {} as Record<string, string>),

		"postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
		"postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
		"postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
		"postpublish:git:push": `git push --follow-tags`,
		"postpublish": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,
		"ncu": "yarn-tool ncu -u",
	}
}
