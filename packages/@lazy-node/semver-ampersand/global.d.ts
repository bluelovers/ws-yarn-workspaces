
declare module 'semver/internal/parse-options'
{
	import { IOptionsOrLoose } from '@lazy-node/semver-ampersand/lib/types';
	import { Options } from 'semver';

	function parseOptionsOrLoose<T extends Options>(options: IOptionsOrLoose<T>): T;

	export = parseOptionsOrLoose
}
