declare module 'semver/internal/parse-options'
{
	import { IOptionsOrLoose } from '@lazy-node/semver-ampersand/lib/types';
	import { Options } from 'semver';

	function parseOptionsOrLoose<T extends Options>(options: IOptionsOrLoose<T>): T;

	export = parseOptionsOrLoose
}

declare module 'semver/internal/re'
{
	const re: RegExp[];
	const src: string[];
	const t: {
		"NUMERICIDENTIFIER": 0,
		"NUMERICIDENTIFIERLOOSE": 1,
		"NONNUMERICIDENTIFIER": 2,
		"MAINVERSION": 3,
		"MAINVERSIONLOOSE": 4,
		"PRERELEASEIDENTIFIER": 5,
		"PRERELEASEIDENTIFIERLOOSE": 6,
		"PRERELEASE": 7,
		"PRERELEASELOOSE": 8,
		"BUILDIDENTIFIER": 9,
		"BUILD": 10,
		"FULLPLAIN": 11,
		"FULL": 12,
		"LOOSEPLAIN": 13,
		"LOOSE": 14,
		"GTLT": 15,
		"XRANGEIDENTIFIERLOOSE": 16,
		"XRANGEIDENTIFIER": 17,
		"XRANGEPLAIN": 18,
		"XRANGEPLAINLOOSE": 19,
		"XRANGE": 20,
		"XRANGELOOSE": 21,
		"COERCE": 22,
		"COERCERTL": 23,
		"LONETILDE": 24,
		"TILDETRIM": 25,
		"TILDE": 26,
		"TILDELOOSE": 27,
		"LONECARET": 28,
		"CARETTRIM": 29,
		"CARET": 30,
		"CARETLOOSE": 31,
		"COMPARATORLOOSE": 32,
		"COMPARATOR": 33,
		"COMPARATORTRIM": 34,
		"HYPHENRANGE": 35,
		"HYPHENRANGELOOSE": 36,
		"STAR": 37,
		"GTE0": 38,
		"GTE0PRE": 39
	};
	const tildeTrimReplace: "$1~";
	const caretTrimReplace: "$1^";
	const comparatorTrimReplace: "$1$2$3";
}

declare module 'semver/internal/debug'
{
	function debug(...argv): void;

	export = debug;
}
