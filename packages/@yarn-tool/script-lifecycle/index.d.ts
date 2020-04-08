import { ILifecycleMapKeys, ILifecycleEntry, ILifecycleMapEntry } from './lib/types';
export declare function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K): {
    install: {
        name: "install";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
    pack: {
        name: "pack";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
    publish: {
        name: "publish";
        ignoreSelf: boolean;
        before: string[];
        after: string[];
    };
}[K];
export declare function getLifecycle<K extends ILifecycleMapKeys>(scriptName: string | K): ILifecycleMapEntry<K>;
export declare function getLifecycleList<K extends ILifecycleMapKeys>(scriptName: string | K, includeSelf?: boolean): string[];
export declare function entryToList(entry: ILifecycleMapEntry | ILifecycleEntry, includeSelf?: boolean): string[];
export declare function isKnownLifecycleKey<K extends ILifecycleMapKeys>(scriptName: string | K): scriptName is ILifecycleMapKeys;
