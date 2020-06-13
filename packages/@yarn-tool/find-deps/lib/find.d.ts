import { IListableRowExtraWithDeps } from 'ws-pkg-list';
export declare function findDepsAllDeepRecordCore<R extends IListableRowExtraWithDeps>(names: string[], record: Record<string, R>, map?: Record<string, string[]>): Record<string, string[]>;
export declare function findDepsAllDeep<R extends IListableRowExtraWithDeps>(names: string[], record: Record<string, R>): [string, string[]][];
export declare function findDepsDeep<R extends IListableRowExtraWithDeps>(name: string, record: Record<string, R>, list?: string[]): string[];
export default findDepsAllDeep;
