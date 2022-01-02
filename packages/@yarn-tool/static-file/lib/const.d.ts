import { IStaticFilesMapArray } from './types';
export declare const defaultCopyStaticFiles: IStaticFilesMapArray<"tsconfig.json.tpl" | "test/tsconfig.json.tpl" | "tsconfig.esm.json.tpl" | "tsconfig.tsdx.json.tpl" | ".eslintrc.json.tpl" | "now.json.tpl" | ".npmrc.tpl" | "tsdx.config.js.tpl" | "tsc-multi.json.tpl">;
export declare const defaultCopyStaticFilesRootOnly: IStaticFilesMapArray<"tsconfig.json" | ".eslintrc.json" | "lerna.json.tpl" | "pnpm-workspace.yaml.tpl">;
export declare const defaultCopyStaticFilesWsRootOnly: IStaticFilesMapArray<"tsc-multi.json.tpl">;
