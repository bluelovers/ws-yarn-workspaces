import { versionToParts } from './_core';
import { tryCompare, IOptionsOrLoose, ICompareReturnType } from './compare';

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

export function parseVersionsAndCompare(versionOld: string, versionNew: string, optionsOrLoose?: IOptionsOrLoose): {
	comp: ICompareReturnType;
	versionOld: string;
	versionNew: string;
	partsOld: string[];
	partsNew: string[];
	index: IParseVersionsFindIndex;
}
{
	const data = parseVersions(versionOld, versionNew)

	let comp = tryCompare(data.partsNew[data.index], data.partsOld[data.index], optionsOrLoose);

	return {
		...data,
		comp,
	}
}
