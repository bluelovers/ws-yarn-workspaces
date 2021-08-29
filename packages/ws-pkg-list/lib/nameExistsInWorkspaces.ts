import { wsPkgListable } from './listable';

export function nameExistsInWorkspaces(name: string)
{
	name = name.toLowerCase()

	return wsPkgListable()
		.find(entry => entry.name.toLowerCase() === name)
}
