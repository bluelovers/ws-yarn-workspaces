import type { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse/index';
import { PathLike, readFileSync } from "fs";
import fromContent from './fromContent';

export function fromFile<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike)
{
	return fromContent<T>(readFileSync(yarnlock_file))
}

export async function fromFileAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike)
{
	return fromFile<T>(yarnlock_file)
}
