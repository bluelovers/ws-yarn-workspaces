/**
 * Created by user on 2020/6/5.
 */
import { wsFindPackageHasModules } from '@yarn-tool/node-modules';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { wsFindPackageHasModulesCore } from '@yarn-tool/node-modules/lib/ws-find-paths';
import { IListableRow } from 'ws-pkg-list';
import yarnListLink from 'yarn-list-link/core';
import { linkSync, realpathSync, removeSync, pathExistsSync, symlinkSync, unlinkSync } from 'fs-extra';
import crossSpawn from 'cross-spawn-extra';
import { sameRealpath, isSymbolicLink } from './lib/util';
import console from 'debug-color2/logger';

export function fixYarnWorkspaceLinks(cwd?: string, options?: {
	dir?: string,
	verbose?: boolean,
	runYarnAfter?: boolean,
})
{
	let listable = wsPkgListable(cwd);
	let links = yarnListLink(cwd) || [];

	let pkgs = listable
		.reduce((a, b) =>
		{

			a[b.name] = b;

			return a
		}, {} as Record<string, IListableRow>)
	;

	options = options || {};

	let sublist = wsFindPackageHasModulesCore(listable, options.dir)

	let verbose = options.verbose;

	verbose && console.debug('[linkedModules]', links);

	if (sublist.length)
	{

		sublist
			.forEach(data =>
			{
				let _error: boolean;

				verbose && console.debug(`check`, data.name, `=>`, data.location);

				let add_links = [] as string[];

				data.modules.forEach(row =>
				{

					let name = row.name;
					let location = pkgs[name]?.location;

					let is_same = sameRealpath(location, row.location)

					if (!pathExistsSync(row.location))
					{
						return;
					}

					let is_symlink = isSymbolicLink(row.location);

					if (location && is_same === false && !is_symlink)
					{
						if (links.includes(name))
						{
							add_links.push(name)
						}
						else
						{
							try
							{
								unlinkSync(row.location);
								symlinkSync(location, row.location);

								console.success(`create link`, row.name, `=>`, location)
							}
							catch (e)
							{
								verbose && console.error(e.toString());
								_error = true;

								if (links.includes(name))
								{
									add_links.push(name)
								}
							}
						}
					}
					else if (!is_symlink && links.includes(name))
					{
						add_links.push(name)
					}
					else if (typeof is_same === 'undefined')
					{
						_error = true;
					}

				})
				;

				if (add_links.length)
				{
					verbose && console.debug('link', [
						...add_links,
					]);
					crossSpawn.sync('yarn', [
						`link`,
						...add_links,
					], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

				if (_error || options.runYarnAfter)
				{
					verbose && console.debug(`try use yarn install for fallback`);

					crossSpawn.sync('yarn', [], {
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

