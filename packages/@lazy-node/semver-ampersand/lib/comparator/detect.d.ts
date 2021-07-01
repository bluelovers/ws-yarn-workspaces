import Comparator from 'semver/classes/comparator';
export declare function isNullSet<T extends Comparator>(c: T): c is T & {
    value: '<0.0.0-0';
};
export declare function isAny<T extends Comparator>(c: T): c is T & {
    value: '';
};
