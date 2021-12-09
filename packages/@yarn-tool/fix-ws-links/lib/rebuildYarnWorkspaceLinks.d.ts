import { IListableRow } from 'ws-pkg-list/lib/types';
import { IOptions } from '@yarn-tool/node-modules-link';
export declare function _checkOptions(options: Partial<IOptions>, auto?: boolean): asserts options is IOptions;
export declare function rebuildYarnWorkspaceLinksFromPkgListable(listable: IListableRow[], options: Partial<IOptions>): void;
export declare function rebuildYarnWorkspaceLinks(options?: Partial<IOptions>): void;
