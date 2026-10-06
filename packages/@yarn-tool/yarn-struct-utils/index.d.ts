/**
 * Yarn 結構化解析工具入口
 * Yarn structured parsing utilities entry
 *
 * 提供把 resolution / descriptor 字串轉成結構化資料的能力，
 * 供 yarn-tool 其他套件共用。
 * Provides the ability to turn resolution / descriptor strings into structured data,
 * shared by other yarn-tool packages.
 *
 * @packageDocumentation
 */
/**
 * 解析 resolution 或 descriptor 字串
 * Parse a resolution or descriptor string
 *
 * 先嘗試以 resolution 格式解析；失敗時才退回 descriptor，
 * 因為 resolution 的語法較嚴格，可作為快速的格式判別。
 * Tries the resolution format first and only falls back to descriptor when that fails,
 * because resolution syntax is stricter and thus serves as a quick format discriminator.
 *
 * @param {string} rawInput - 待解析的字串 / The string to parse
 * @returns {object | null} 解析結果，完全無法解析時回傳 null / Parse result, or null when it cannot be parsed at all
 *
 * @example
 * parseResolutionOrDescriptor('lodash@npm:^4.17.21'); // { isResolution: true, ... }
 * parseResolutionOrDescriptor('lodash@npm:4.17.21');  // { isResolution: false, ... }
 */
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
    parsed: import("@yarnpkg/core").Descriptor;
    parsedRange: import("./lib/parseRange").IParseRangeReturnType<import("./lib/parseRange").IParseRangeOptions>;
    rawInput: string;
};
