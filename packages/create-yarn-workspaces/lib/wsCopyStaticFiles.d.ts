import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '@yarn-tool/static-file/lib/const';
import { IStaticFiles, IStaticFilesKey } from '@yarn-tool/static-file/lib/types';
declare const remap: {
    readonly 'tsconfig.json': "tsconfig.json.tpl";
    readonly 'lerna.json': "lerna.json.tpl";
    readonly 'pnpm-workspace.yaml': "pnpm-workspace.yaml.tpl";
};
export declare function getWsCopyStaticFiles(): IStaticFiles<IStaticFilesKey<typeof defaultCopyStaticFiles | typeof defaultCopyStaticFilesRootOnly> | keyof typeof remap>;
export default getWsCopyStaticFiles;
