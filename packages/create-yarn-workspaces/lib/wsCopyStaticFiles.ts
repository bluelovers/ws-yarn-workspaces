import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '@yarn-tool/static-file/lib/const';
import { IStaticFiles, IStaticFilesKey, IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
import { reMapStaticFilesMapArray } from '@yarn-tool/static-file/lib/reMapStaticFilesMapArray';

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
	], remap);
}

export default getWsCopyStaticFiles;
