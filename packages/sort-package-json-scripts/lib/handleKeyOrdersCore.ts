import type { ISortPackageJsonScriptsOptions, ISortPackageJsonScriptsOptionsRequired } from './types';

export function handleKeyOrdersCore(names: string[], {
	otherScriptNames,
	defaultNpmScriptsOrder,
	omitKeyFn,
	sortKeyFn,
}: ISortPackageJsonScriptsOptions | ISortPackageJsonScriptsOptionsRequired)
{
	const prefixable = new Set<string>()
	const keymap = {} as Record<string, string[]>

	const addToPrefixable1 = (value: string, {
		key,
		omitted,
		name,
		list,
	}: {
		key: string,
		omitted: string,
		name: string,
		list: string[],
	}) =>
	{
		keymap[key] = (keymap[key] ?? []);
		keymap[key].push(name);

		prefixable.add(value);
		list.push(value);
	}

	const keys = names
		.sort(sortKeyFn)
		.reduce((a, name) =>
		{
			const { key, omitted } = omitKeyFn(name)

			if (defaultNpmScriptsOrder.has(name))
			{
				addToPrefixable1(name, {
					key,
					omitted,
					name,
					list: a.list2,
				})
			}
			else if (defaultNpmScriptsOrder.has(key))
			{
				addToPrefixable1(key, {
					key,
					omitted,
					name,
					list: a.list2,
				})
			}
			else if (defaultNpmScriptsOrder.has(omitted))
			{
				addToPrefixable1(omitted, {
					key,
					omitted,
					name,
					list: a.list2,
				})
			}
			else if (otherScriptNames.has(name))
			{
				addToPrefixable1(name, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else if (otherScriptNames.has(key))
			{
				addToPrefixable1(key, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else if (otherScriptNames.has(omitted) || key !== omitted)
			{
				addToPrefixable1(omitted, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else if (name !== key)
			{
				addToPrefixable1(key, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else
			{
				a.list1.push(name)
			}

			return a
		}, {
			list1: [] as string[],
			list2: [] as string[],
		})
	;

	const order = [
		...defaultNpmScriptsOrder.values(),
		...keys.list2,
		...keys.list1,
	].reduce((order, key) =>
		{
			if (prefixable.has(key))
			{
				order.push(`pre${key}`);
				order.push(...(keymap[`pre${key}`]?.sort?.() ?? []));
				order.push(key);
				order.push(...(keymap[key]?.sort?.() ?? []));
				order.push(`post${key}`);
				order.push(...(keymap[`post${key}`]?.sort?.() ?? []));
			}
			else
			{
				order.push(key)
			}

			return order
		}, [] as string[],
	)

	return order
}

export default handleKeyOrdersCore
