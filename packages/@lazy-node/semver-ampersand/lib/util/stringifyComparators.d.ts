/**
 * Created by user on 2021/6/26.
 */
import Comparator from 'semver/classes/comparator';
import { ITSArrayListMaybeReadonly } from 'ts-type';
export declare function stringifyComparators(comparators: ITSArrayListMaybeReadonly<Comparator>): string;
export declare function stringifyComparatorsSet(comparators: ITSArrayListMaybeReadonly<ITSArrayListMaybeReadonly<Comparator>>): string;
