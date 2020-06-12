export declare const reShebang: RegExp;
/**
 * Extract normalized shebang command token.
 *
 *
 * Examples:
 *
 *  shebang("#!/usr/bin/ruby") // "ruby"
 *
 *  shebang("#!/usr/bin/env node") // "node"
 *
 *  @param: {String}
 *  @return {String|null}
 */
export declare function shebang(line: string): IScriptName;
export declare function removeShebang(line: string): string;
export declare type IScriptName = string | 'env' | 'node' | 'sh';
export interface IMatchShebangReturnType {
    shebang: string;
    bin: string;
    name: IScriptName;
    script: IScriptName;
    argv: string | '';
    isExtra: boolean;
}
export declare function matchShebang(line: string): IMatchShebangReturnType;
export default shebang;
