import { ReleaseType } from 'semver';

export interface INextVersionRecommended
{
	bump: ReleaseType;
	oldVersion: string;
	newVersion: string;
}

export interface INextVersionRecommendedOptions
{
	cwd?: string;
	bump?: ReleaseType;
	major?: boolean;
	minor?: boolean;
	patch?: boolean;
	premajor?: boolean;
	preminor?: boolean;
	prepatch?: boolean;
	prerelease?: boolean;
}

export const releaseTypes: ReleaseType[] = [
	'major',
	'minor',
	'patch',
	'premajor',
	'preminor',
	'prepatch',
	'prerelease',
];
