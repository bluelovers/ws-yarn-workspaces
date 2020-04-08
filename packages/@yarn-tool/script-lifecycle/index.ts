import { ILifecycleMapKeys, ILifecycleMap, ILifecycleEntry, ILifecycleMapEntry } from './lib/types';
import lifecycleMap from './lib/lifecycle';

export function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K)
{
	if (isKnownLifecycleKey(scriptName))
	{
		return lifecycleMap[scriptName]
	}

	//return (lifecycleMap as ILifecycleMap)[scriptName]
}

export function getLifecycle<K extends ILifecycleMapKeys>(scriptName: string | K): ILifecycleMapEntry<K>
{
	return getLifecycleCore(scriptName) ?? ({
		name: scriptName,
		ignoreSelf: false,
		before: [
			`pre${scriptName}`
		],
		after: [
			`post${scriptName}`
		],
	} as ILifecycleEntry<K>) as any
}

export function getLifecycleList<K extends ILifecycleMapKeys>(scriptName: string | K, includeSelf?: boolean)
{
	return entryToList(getLifecycle(scriptName), includeSelf)
}

export function entryToList(entry: ILifecycleMapEntry | ILifecycleEntry, includeSelf?: boolean)
{
	let result = [] as string[]

	if (entry.before?.length)
	{
		result.push(...entry.before)
	}

	if (includeSelf === true || entry.ignoreSelf !== true)
	{
		result.push(entry.name)
	}

	if (entry.after?.length)
	{
		result.push(...entry.after)
	}

	return result
}

export function isKnownLifecycleKey<K extends ILifecycleMapKeys>(scriptName: string | K): scriptName is ILifecycleMapKeys
{
	return scriptName in lifecycleMap
}
