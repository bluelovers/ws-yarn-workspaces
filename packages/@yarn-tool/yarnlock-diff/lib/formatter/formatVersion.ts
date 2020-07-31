export function _formatVersion(rhsOrLhs: unknown): string
{
	switch (typeof rhsOrLhs)
	{
		case "string":
			return rhsOrLhs;
		case "object":
			return Array.isArray(rhsOrLhs)
				? rhsOrLhs.join(", ")
				: JSON.stringify(rhsOrLhs);
		default:
			return `${rhsOrLhs}`;
	}
}
