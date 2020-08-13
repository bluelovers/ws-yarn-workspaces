import { IBufferOrString } from './types';

export function notEmpty(buf: IBufferOrString)
{
	return buf?.length > 0
}
