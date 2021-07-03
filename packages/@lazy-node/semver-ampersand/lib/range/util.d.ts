import { IOptions } from '../types';
/**
 * This function is passed to string.replace(re[t.HYPHENRANGE])
 * M, m, patch, prerelease, build
 * 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
 * 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
 * 1.2 - 3.4 => >=1.2.0 <3.5.0-0
 */
export declare function hyphenReplace(incPr: boolean): ($0: string, from: string, fM: string, fm: string, fp: string, fpr: string, fb: string, to: string, tM: string, tm: string, tp: string, tpr: string, tb: string) => string;
export declare function isX(id: string): id is '' | '0' | '*' | 'x';
export declare function replaceGTE0(comp: string, options: IOptions): string;
/**
 * comprised of xranges, tildes, stars, and gtlt's at this point.
 * already replaced the hyphen ranges
 * turn into a set of JUST comparators.
 */
export declare function parseComparator(comp: string, options: IOptions): string;
/**
 * ~, ~> --> * (any, kinda silly)
 * ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
 * ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
 * ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
 */
export declare function replaceTildes(comp: string, options: IOptions): string;
export declare function replaceTilde(comp: string, options: IOptions): string;
/**
 * ^ --> * (any, kinda silly)
 * ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
 * ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
 * ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
 * ^1.2.3 --> >=1.2.3 <2.0.0-0
 * ^1.2.0 --> >=1.2.0 <2.0.0-0
 */
export declare function replaceCarets(comp: string, options: IOptions): string;
export declare function replaceCaret(comp: string, options: IOptions): string;
export declare function replaceXRanges(comp: string, options: IOptions): string;
export declare function replaceXRange(comp: string, options: IOptions): string;
/**
 * and '' means "any version", just remove the *s entirely.
 */
export declare function replaceStars(comp: string, options: IOptions): string;
