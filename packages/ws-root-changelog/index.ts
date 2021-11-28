import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { normalizeListableRowExtra } from 'ws-pkg-list/lib/util';
import { findRootLazy } from '@yarn-tool/find-root';
import { writeFileSync, promises } from 'fs';
import { resolve } from 'upath2';

export function listChangelog(cwd: string)
{
	const list: string[] = [];

	wsPkgListable(cwd, {
		handler(row)
		{
			return normalizeListableRowExtra(row, cwd)
		},
	})
		.forEach((row) =>
		{

			row = normalizeListableRowExtra(row, cwd);

			const icon = row.private ? `🔒` : `🌏`;

			list.push(`* ${icon} [\`${row.name}\`](./${row.prefix}/CHANGELOG.md "${row.prefix}") *${row.prefix}*`);

		})
	;

	if (!list.length)
	{
		throw new RangeError(`can't found any packages in current workspace: ${cwd}`);
	}

	return list
}

export function _findWorkspacesRootPath(cwd?: string)
{
	return findRootLazy({
		cwd: cwd ?? process.cwd(),
		throwError: true,
		shouldHasWorkspaces: true,
	}).ws
}

export function getWorkspacesRootChangelogPath(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	filename ??= `./CHANGELOG.md`;

	return resolve(cwd, filename)
}

export function outputWorkspacesRootChangelog(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	const md = createWorkspacesRootChangelog(cwd);

	const file = getWorkspacesRootChangelogPath(cwd, filename);

	writeFileSync(file, md);

	return {
		file,
		md,
	}
}

export async function outputWorkspacesRootChangelogAsync(cwd?: string, filename?: string)
{
	cwd = _findWorkspacesRootPath(cwd);
	const md = createWorkspacesRootChangelog(cwd);

	const file = getWorkspacesRootChangelogPath(cwd, filename);

	await promises.writeFile(file, md);

	return {
		file,
		md,
	}
}

export function createWorkspacesRootChangelog(cwd?: string)
{
	const list: string[] = [];

	list.push('# Change Log');
	list.push('');
	list.push('Please see the individual package changelogs for what\'s new:');
	list.push('');

	cwd = _findWorkspacesRootPath(cwd);

	list.push(...listChangelog(cwd));

	list.push('');
	list.push('');

	return list.join('\n')
}

export default createWorkspacesRootChangelog
