export declare function _versionUnsafe(part: string, defaultValue?: string): `0.0.${string}`;
export declare function _versionSafe(part: string): string;
export declare function _part(part1: string, part2: string): [string, string];
export declare function partsToVersion(parts: string[]): string;
export declare function versionToParts(version: string): string[];
