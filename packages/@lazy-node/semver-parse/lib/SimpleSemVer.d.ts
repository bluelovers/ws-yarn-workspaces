import { ISimpleSemVerObject, ISimpleSemVer } from './types';
export declare class SimpleSemVer implements ISimpleSemVerObject {
    operator?: string;
    semver: string;
    major: string;
    minor?: string;
    patch?: string;
    release?: string;
    build?: string;
    constructor(obj: ISimpleSemVer);
    toString(): string;
}
