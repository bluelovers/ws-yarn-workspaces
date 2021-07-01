import { IComparatorSetInput, IOptionsOrLoose } from '../types';
export declare function hasInvalidCharacter(semver: string, optionsOrLoose?: IOptionsOrLoose): boolean;
export declare function assertInvalidCharacter(semver: string, optionsOrLoose?: IOptionsOrLoose): asserts semver is string;
export declare function assertInvalidComparatorSet(comparatorsSet: IComparatorSetInput, message?: string): asserts comparatorsSet is IComparatorSetInput;
