import { IResult } from '@yarn-tool/npm-package-arg-util';
export declare function normalizeResultToDepsValue(result: ReturnType<typeof _getNpaResult>): string;
export declare function _getNpaResult(value: string): IResult;
export declare function normalizeDepsValue(value: string): string;
export default normalizeDepsValue;
