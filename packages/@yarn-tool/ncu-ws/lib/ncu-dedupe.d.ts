import { IArgvRuntime, IRuntime } from './types';
import { npmCheckUpdates } from '@yarn-tool/ncu';
export declare function _handleDedupe(argv: IArgvRuntime, runtime: IRuntime, pkgNcu: Awaited<ReturnType<typeof npmCheckUpdates>>): Promise<boolean>;
