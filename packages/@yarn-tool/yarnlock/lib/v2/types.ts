import { ITSArrayListMaybeReadonly } from 'ts-type';
import { IYarnLockfileParseObjectRowBase } from '../base/types';

export enum EnumLinkType
{
	'hard' = 'hard',
	'soft' = 'soft',
}

export enum EnumLanguageName
{
	'node' = 'node',
	'unknown' = 'unknown',
}

export interface IYarnLockfileParseObjectRowV2<T extends ITSArrayListMaybeReadonly<string> = string[]> extends IYarnLockfileParseObjectRowBase<T>
{
	resolution: 'library@npm:2.1.0',
	checksum: '2/6fc98369f954229cbb6e4ce1a27a4202a17b4ad67b8def64322e9351414eef405b8783ecbe1b8f0334e52935ae8c43cd3bcc8abd78500227d491516a9a9d96aa',
	languageName: string | EnumLanguageName,
	linkType: string | EnumLinkType
}

export type IYarnLockfileParseObjectV2<T extends ITSArrayListMaybeReadonly<string> = string[]> = Record<string, IYarnLockfileParseObjectRowV2<T>> & {
	__metadata: {
		version: string | '4',
	}
}
