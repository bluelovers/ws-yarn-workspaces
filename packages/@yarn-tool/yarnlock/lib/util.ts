/**
 * Created by user on 2020/6/11.
 */

import { IVersionValue } from '@ts-type/package-dts/lib/package-json/types';

export function stripDepsName<T = string>(name: string): [T, IVersionValue]
{
	let m = name.match(/^(@?.+?)@(.+)$/);

	if (!m)
	{
		throw new TypeError(`name is not dependencies, ${name}`)
	}

	let r = m.slice(1);

	//console.dir(r);
	//process.exit()

	return r as any
}
