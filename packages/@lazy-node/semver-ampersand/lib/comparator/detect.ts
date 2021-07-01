import Comparator from 'semver/classes/comparator';

export function isNullSet<T extends Comparator>(c: T): c is T & {
	value: '<0.0.0-0'
}
{
	return c.value === '<0.0.0-0';
}

export function isAny<T extends Comparator>(c: T): c is T & {
	value: ''
}
{
	return c.value === '';
}
