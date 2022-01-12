export function defaultSharedRootScripts()
{
	return {
		"ci:install": "yarn add -W typescript@next jest ts-jest ts-node ynpx lerna",
	}
}
