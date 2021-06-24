import Bluebird from 'bluebird';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IOptionsInstallDepsFromYarnLock } from '../types';
export declare function fetchRemoteInfo<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Bluebird<Record<string, IParsePackageName & {
    versionQuery: string;
}> & Record<T, IParsePackageName & {
    versionQuery: string;
}>>;
