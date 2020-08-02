import { ReleaseType } from 'semver';

export interface INextVersionRecommended
{
	bump: ReleaseType;
	oldVersion: string;
	newVersion: string;
}
