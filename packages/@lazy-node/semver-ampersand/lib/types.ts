import { Options } from 'semver';

export interface IOptions extends Options
{
	noAmpersand?: boolean
}

export type IOptionsOrLoose<T extends Options = IOptions> = boolean | T
