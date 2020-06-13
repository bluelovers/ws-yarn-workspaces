import { IListableRowExtraWithDeps } from 'ws-pkg-list';
export declare function findUpDepsDeepRecordCore<R extends IListableRowExtraWithDeps>(target: string, record: Record<string, R>, map?: Record<string, string[]>): Record<string, string[]>;
export declare function findUpDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(targets: string[], record: Record<string, R>, map?: Record<string, string[]>): Record<string, string[]>;
export declare function findUpDepsAllDeep<R extends IListableRowExtraWithDeps>(targets: string[], record: Record<string, R>): [string, string[]][];
export default findUpDepsAllDeep;
