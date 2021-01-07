import copyStaticFiles, { defaultCopyStaticFiles, IStaticFilesMapArray } from '@yarn-tool/static-file';

export function getWsCopyStaticFiles(): IStaticFilesMapArray<string>
{
	return [
		['tsconfig.json', 'file/tsconfig.json.tpl'],
		['lerna.json', 'file/lerna.json.tpl'],
		['pnpm-workspace.yaml', 'file/pnpm-workspace.yaml'],
		...defaultCopyStaticFiles,
	];
}

export default getWsCopyStaticFiles;
