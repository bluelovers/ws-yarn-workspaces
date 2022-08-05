import { IResult } from '@yarn-tool/npm-package-arg-util';

export interface IParseNameAndVersionWithNpaResult extends Pick<IResult, 'type' | 'raw'>
{
	name: string;
	version: string;
	semver: string,
}
