import { versionToParts } from './_core';
import { tryCompare } from './compare';

export type IParseVersionsFindIndex = 0 | 1 | 2;

export function parseVersions(versionOld: string, versionNew: string)
{
	const partsNew = versionToParts(versionNew);
	const partsOld = versionToParts(versionOld);

	let index: IParseVersionsFindIndex = partsNew.findIndex((part, i) => part !== partsOld[i]) as any;

	index = index >= 0 ? index : partsNew.length as any;

	return {
		versionOld,
		versionNew,

		partsOld,
		partsNew,

		index,
	}
}

export function parseVersionsAndCompare(versionOld: string, versionNew: string)
{
	const data = parseVersions(versionOld, versionNew)

	let comp = tryCompare(data.partsNew[data.index], data.partsOld[data.index]);

	return {
		...data,
		comp,
	}
}
