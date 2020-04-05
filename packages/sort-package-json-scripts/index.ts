import sortObjectKeys from 'sort-object-keys2';
import { omitKey, otherNpmScriptsOrder, defaultNpmScriptsOrder } from './lib/util';

export function sortPackageJsonScript<T extends Record<string, any>>(scripts: T): T
{
	const names = Object.keys(scripts)
	const prefixable = new Set<string>()
	const keymap = {} as Record<string, string[]>

	const addToPrefixable1 = (value: string, {
		key,
		omitted,
		name,
		list
	}: {
		key: string,
		omitted: string,
		name: string,
		list: string[],
	}) => {
		keymap[key] = (keymap[key] ?? []);
		keymap[key].push(name);

		prefixable.add(value);
		list.push(value);
	}

	const keys = names
		.sort()
		.reduce((a, name) =>
		{
			const { key, omitted } = omitKey(name)

			if (defaultNpmScriptsOrder.has(name))
			{
				addToPrefixable1(name, {
					key,
					omitted,
					name,
					list: a.list2,
				})
			}
			if (defaultNpmScriptsOrder.has(key))
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
			else if (otherNpmScriptsOrder.has(name))
			{
				addToPrefixable1(name, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else if (otherNpmScriptsOrder.has(key))
			{
				addToPrefixable1(key, {
					key,
					omitted,
					name,
					list: a.list1,
				})
			}
			else if (otherNpmScriptsOrder.has(omitted) || key !== omitted)
			{
				addToPrefixable1(omitted, {
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
	].reduce((order, key) => {

		if (prefixable.has(key))
		{
			order.push(...(keymap[`pre${key}`]?.sort?.() ?? []));
			order.push(...(keymap[key]?.sort?.() ?? []));
			order.push(...(keymap[`post${key}`]?.sort?.() ?? []));
		}
		else
		{
			order.push(key)
		}

		return order
		}, [] as string[],
	)

	return sortObjectKeys(scripts, {
		keys: order,
	}) as T
}

export default sortPackageJsonScript
