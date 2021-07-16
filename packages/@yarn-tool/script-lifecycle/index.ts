import { ILifecycleMapKeys, ILifecycleMap, ILifecycleEntry, ILifecycleMapEntry, ILifecycleList } from './lib/types';
import lifecycleMap from './lib/lifecycle';

export function getLifecycleCore<K extends ILifecycleMapKeys>(scriptName: string | K)
{
	if (isKnownLifecycleKey(scriptName))
	{
		return lifecycleMap[scriptName] as ILifecycleMapEntry<K>
	}

	//return (lifecycleMap as ILifecycleMap)[scriptName]
}

export function getLifecycle<K extends string | ILifecycleMapKeys>(scriptName: K,
	currentScriptOnly?: boolean,
): ILifecycleEntry<K>
{
	let entry: ILifecycleEntry<K>

	if (!currentScriptOnly)
	{
		entry = getLifecycleCore(scriptName) as ILifecycleEntry<K>;
	}

	return entry ?? ({
		name: scriptName,
		ignoreSelf: false,
		before: [
			`pre${scriptName}` as const,
		],
		after: [
			`post${scriptName}` as const,
		],
	} as ILifecycleEntry<K>)
}

export function getLifecycleList<K extends string | ILifecycleMapKeys>(scriptName: K,
	includeSelf?: boolean,
	currentScriptOnly?: boolean,
): ILifecycleList<K>
{
	return entryToList(getLifecycle(scriptName, currentScriptOnly), includeSelf)
}

export function entryToList<K extends string | ILifecycleMapKeys>(entry: ILifecycleMapEntry<K> | ILifecycleEntry<K>,
	includeSelf?: boolean,
): ILifecycleList<K>
{
	let result = [] as ILifecycleList<K>

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
