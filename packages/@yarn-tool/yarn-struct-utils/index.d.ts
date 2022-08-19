export declare function parseResolutionOrDescriptor(rawInput: string): {
    fullName: string;
    description: string;
    isResolution: true;
    parsed: import("@yarnpkg/parsers").Resolution;
    rawInput: string;
    parsedRange?: undefined;
} | {
    fullName: string;
    description: string;
    isResolution: false;
    parsed: import("@yarnpkg/core/lib/types").Descriptor;
    parsedRange: import("./lib/parseRange").IParseRangeReturnType<import("./lib/parseRange").IParseRangeOptions>;
    rawInput: string;
};
