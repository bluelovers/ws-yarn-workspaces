export declare const reSemver: RegExp;
/**
 * , reSemverRange = /\s*((\|\||\-)|(([<>~]?=?)\s*(v)?([0-9]+)(\.(x|[0-9]+))?(\.(x|[0-9]+))?(([\-+])([a-zA-Z0-9\.]+))?))\s* /g
 */
export declare const reSemverRange: RegExp;
export declare const simpleSemVerKeys: readonly ["semver", "operator", "version", "major", "minor", "patch", "release", "build"];
export declare const enum EnumVersionExtra {
    build = "+",
    release = "-"
}
