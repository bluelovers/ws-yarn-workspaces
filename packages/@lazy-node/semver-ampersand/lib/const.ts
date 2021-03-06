
export const reSpaces = /\s+/g;

export const reAmpersandAndSpaces = /[&\s]+/g;

export const reInvalidCharacter = /[^\s\w.*\-><~!^|=+]/;

export const reInvalidCharacterOrAmpersand = /[^\s\w.*\-><~!^|=+&]/;

export const reDoubleVerticalBar = /\s*\|\|\s*/g;

export const separatorDoubleVerticalBar = ' || ' as const;

export const enum EnumSemverVersion
{
	/**
	 * nothing is allowed
	 */
	NULL = '<0.0.0-0',
	/**
	 * nothing is forbidden
	 */
	STAR = '*',
	ANY = '',
}
