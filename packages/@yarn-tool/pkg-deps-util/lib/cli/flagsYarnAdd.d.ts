/**
 * 產生 `yarn add` 可用的 flag 陣列 (Produce flags usable by `yarn add`)
 *
 * Produce the flags accepted by `yarn add`.
 *
 * @param argv 已解析的布林選項 (Parsed boolean options)
 *
 * @returns 僅包含已啟用選項的 `--flag` 陣列，順序固定，便於除錯與快照測試
 *
 * An array of `--flag` containing only enabled options, in a fixed order so
 * output stays debuggable and snapshot-friendly.
 */
export declare function flagsYarnAdd(argv: {
    [k: string]: boolean;
}): string[];
