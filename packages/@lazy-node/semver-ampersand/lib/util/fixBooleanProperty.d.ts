import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
export declare const opts: readonly ["includePrerelease", "loose", "rtl"];
export declare function fixBooleanProperty<T extends Record<any, any>>(options: T, fields?: ITSArrayListMaybeReadonly<string>, mode?: boolean): T;
