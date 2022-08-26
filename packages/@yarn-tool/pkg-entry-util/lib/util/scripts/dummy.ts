export function _dummyEchoPrefix(prefix: string)
{
	return `echo ${prefix ?? ''}`.trim();
}

export function _dummyEchoTextCore(pre: string, text: string)
{
	return `${pre} ${text}`.trim();
}

export function _dummyEchoText(prefix: string, text: string)
{
	return _dummyEchoTextCore(_dummyEchoPrefix(prefix), text)
}

export function isDummyEchoMaybe(value: string)
{
	return value?.length && value.startsWith('echo ') && !value.includes('&')
}

export function isDummyEchoMaybeOrEmpty(value: string)
{
	return !value?.length || (value.startsWith('echo ') && !value.includes('&'))
}
