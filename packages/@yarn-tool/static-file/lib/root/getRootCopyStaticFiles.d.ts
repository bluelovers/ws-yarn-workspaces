import { IFindRootReturnType } from '@yarn-tool/find-root';
import { IStaticFilesMapArray } from '../types';
export declare function getRootCopyStaticFilesAuto(rootData: Pick<IFindRootReturnType, 'isRoot' | 'hasWorkspace'>): IStaticFilesMapArray<string>;
