import {
	defaultCopyStaticFiles,
	defaultCopyStaticFilesRootOnly,
	defaultCopyStaticFilesWsRootOnly,
} from '../const';
import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray } from '../types';
import { reMapStaticFilesMapArray } from '../reMapStaticFilesMapArray';

const remap = {
	'tsconfig.json': 'tsconfig.json.tpl',
	'lerna.json': 'lerna.json.tpl',
	'pnpm-workspace.yaml': 'pnpm-workspace.yaml.tpl',
} as const

export function getWsCopyStaticFiles(): IStaticFiles<IStaticFilesKey<typeof defaultCopyStaticFiles | typeof defaultCopyStaticFilesRootOnly> | keyof typeof remap>
{
	return reMapStaticFilesMapArray([
		...defaultCopyStaticFiles,
		...defaultCopyStaticFilesRootOnly,
		...defaultCopyStaticFilesWsRootOnly,
	], remap);
}

export default getWsCopyStaticFiles;
