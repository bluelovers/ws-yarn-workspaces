/**
 * Created by user on 2020/6/5.
 */
import { wsFindPackageHasModules } from '@yarn-tool/node-modules';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { wsFindPackageHasModulesCore } from '@yarn-tool/node-modules/lib/ws-find-paths';
import { IListableRow } from 'ws-pkg-list';
import yarnListLink from 'yarn-list-link/core';
import { linkSync } from 'fs-extra';
import crossSpawn from 'cross-spawn-extra';

export function fixYarnWorkspaceLinks(cwd?: string, options?: {
	dir?: string,
	verbose?: boolean,
})
{
	let listable = wsPkgListable(cwd);
	let links = yarnListLink(cwd);

	let pkgs = listable
		.reduce((a, b) => {

			a[b.name] = b;

			return a
		}, {} as Record<string, IListableRow>)
	;

	let sublist = wsFindPackageHasModulesCore(listable, options?.dir)

	let verbose = options?.verbose;

	if (sublist.length)
	{
		sublist
			.forEach(data => {
				verbose && console.debug(`check`, data.name, `=>`, data.location);

				let add_links = [] as string[];

				data.modules.forEach(row => {

					let name = row.name;
					let location = pkgs[name]?.location;

					if (location)
					{
						console.log(`create link`, row.name, `=>`, location)
						linkSync(location, row.location)
					}
					else if (links.includes(name))
					{
						add_links.push(name)
					}

				})
				;

				if (add_links.length)
				{
					crossSpawn.sync('yarn', [
						`link`,
						...add_links,
					], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

			})
		;
	}
	else
	{
		verbose && console.debug(`no exists sub package has modules with sub install`);
	}
}

export default fixYarnWorkspaceLinks

