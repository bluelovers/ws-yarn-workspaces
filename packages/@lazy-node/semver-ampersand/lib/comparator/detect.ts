import Comparator from 'semver/classes/comparator';
import { EnumSemverVersion } from '../const';

export function isNullSet<T extends Comparator>(c: T): c is T & {
	value: '<0.0.0-0'
}
{
	return c.value === EnumSemverVersion.NULL;
}

export function isAny<T extends Comparator>(c: T): c is T & {
	value: ''
}
{
	return c.value === EnumSemverVersion.ANY;
}
