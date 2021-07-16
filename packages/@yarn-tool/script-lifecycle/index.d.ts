import { ILifecycleMapKeys, ILifecycleEntry, ILifecycleMapEntry, ILifecycleList } from './lib/types';
export declare function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K): ILifecycleMapEntry<K>;
export declare function getLifecycle<K extends string | ILifecycleMapKeys>(scriptName: K, currentScriptOnly?: boolean): ILifecycleEntry<K>;
export declare function getLifecycleList<K extends string | ILifecycleMapKeys>(scriptName: K, includeSelf?: boolean, currentScriptOnly?: boolean): ILifecycleList<K>;
export declare function entryToList<K extends string | ILifecycleMapKeys>(entry: ILifecycleMapEntry<K> | ILifecycleEntry<K>, includeSelf?: boolean): ILifecycleList<K>;
export declare function isKnownLifecycleKey<K extends ILifecycleMapKeys>(scriptName: string | K): scriptName is ILifecycleMapKeys;
