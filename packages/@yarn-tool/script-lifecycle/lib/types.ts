/**
 * Created by user on 2020/4/9.
 */

import lifecycleMap from "./lifecycle";

export interface ILifecycleEntry<K extends string = string>
{
	name: K;
	ignoreSelf?: boolean;
	before: string[];
	after: string[];
}

export type ILifecycleMapKeys = keyof typeof lifecycleMap;

export type ILifecycleMapEntry<K extends string = string | ILifecycleMapKeys> = K extends ILifecycleMapKeys ? (typeof lifecycleMap)[K] : ILifecycleEntry<K>

export type ILifecycleMap<K extends string = string> = typeof lifecycleMap & Record<K, ILifecycleEntry<K>>;
