
export function isAllowedMergeAbleValue(value: string)
{
	return (typeof value === 'string' && value.length > 0 && value !== '*' && value !== 'x')
}
