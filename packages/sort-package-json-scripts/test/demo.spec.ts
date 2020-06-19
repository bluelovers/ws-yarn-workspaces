import sortPackageJsonScripts from '../index';

test(`yarn-tool`, () =>
{
	let source = {
		"test": "echo \"Error: no test specified\" && exit 1",
		"npm:publish": "npm publish",
		"npm:publish:lerna": "npx lerna publish --yes --bump patch",
		"prepublish:yarn:install": "yarn-tool install",
		"prepublishOnly": "yarn run ncu && yarn run prepublish:yarn:install && yarn run sort-package-json",
		"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
		"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
		"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
		"prepublishOnly_": "yarn run prepublishOnly:update && yarn run prepublishOnly:check-bin && yarn run test",
		"postpublish": "yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push",
		"postpublish:changelog": "ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md",
		"postpublish:git:commit": "git commit -m \"chore(release): publish\" . & echo postpublish:git:commit",
		"postpublish:git:push": "git push --follow-tags",
		"postpublish:git:tag": "ynpx --quiet @yarn-tool/tag",
		"help": "yarn-tool --help",
		"ncu": "ynpx yarn-tool -- ncu -u",
		"sort-package-json": "ynpx yarn-tool -- sort",
	}

	let actual = sortPackageJsonScripts(source)

	expectMatchSnapshot(actual, source)

});

function expectStringify(actual, expected)
{
	expect(actual).toStrictEqual(expected);
	expect(JSON.stringify(actual, null, 2)).toStrictEqual(JSON.stringify(expected, null, 2));
}

function expectMatchSnapshot(actual, fixture)
{
	expect(actual).toStrictEqual(fixture);

	//expect(actual).toMatchSnapshot();
	expect(Object.keys(actual)).toMatchSnapshot();
	expect(JSON.stringify(actual, null, 2)).toMatchSnapshot();

	console.dir(actual)
}
