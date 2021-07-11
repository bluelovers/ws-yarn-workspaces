export declare const reSpaces: RegExp;
export declare const reAmpersandAndSpaces: RegExp;
export declare const reInvalidCharacter: RegExp;
export declare const reInvalidCharacterOrAmpersand: RegExp;
export declare const reDoubleVerticalBar: RegExp;
export declare const separatorDoubleVerticalBar: " || ";
export declare const enum EnumSemverVersion {
    /**
     * nothing is allowed
     */
    NULL = "<0.0.0-0",
    /**
     * nothing is forbidden
     */
    STAR = "*",
    ANY = ""
}
