"use strict";
/**
 * lerna.json sorting utility / lerna.json 排序工具
 *
 * This module provides utilities for sorting lerna.json configuration files.
 * It ensures consistent key ordering for better readability and version control.
 *
 * 此模組提供排序 lerna.json 配置檔案的工具函式。
 * 確保鍵值順序一致，提高可讀性和版本控制友好性。
 *
 * @module @yarn-tool/sort-lerna-json
 *
 * @example
 * ```typescript
 * import sortLernaJson, { sortLernaJsonFile } from '@yarn-tool/sort-lerna-json';
 *
 * // Sort a lerna.json object
 * const sorted = sortLernaJson(lernaConfig);
 *
 * // Sort and write lerna.json file
 * sortLernaJsonFile('./lerna.json');
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortLernaJsonCommandEntry = sortLernaJsonCommandEntry;
exports.sortLernaJsonCommand = sortLernaJsonCommand;
exports.sortLernaJson = sortLernaJson;
exports.sortLernaJsonFile = sortLernaJsonFile;
const sort_object_keys2_1 = require("sort-object-keys2");
const fs_json_1 = require("@bluelovers/fs-json");
const write_package_json_1 = require("@yarn-tool/write-package-json");
/**
 * Sort a lerna command entry object.
 * 排序 lerna 命令項物件。
 *
 * Sorts the keys within a command entry (e.g., publish, version, run, exec)
 * in a predefined order for consistency.
 *
 * 將命令項（如 publish、version、run、exec）內的鍵按預定義順序排序。
 *
 * @template T - The command entry type / 命令項類型
 * @param value - The command entry object to sort / 要排序的命令項物件
 * @returns The sorted command entry object / 排序後的命令項物件
 *
 * @example
 * ```typescript
 * const entry = {
 *   bump: 'minor',
 *   concurrency: 4,
 *   stream: true,
 * };
 *
 * const sorted = sortLernaJsonCommandEntry(entry);
 * // Returns: { concurrency: 4, stream: true, bump: 'minor', ... }
 * ```
 */
function sortLernaJsonCommandEntry(value) {
    /**
     * 順序表直接寫在函式內：命令項的鍵集合由 lerna CLI 決定且極少變動，
     * 就地維護可避免為了單一使用者而抽出全域常數；
     * useSource: true 表示原地回寫，故回傳值即同一個物件。
     *
     * The order list lives inside the function: the entry key set is dictated by the
     * lerna CLI and rarely changes, so it is kept local instead of becoming a global
     * constant for a single consumer; `useSource: true` mutates in place, hence the
     * returned object is the same instance.
     */
    return (0, sort_object_keys2_1.sortObjectKeys)(value, {
        keys: [
            'concurrency',
            'stream',
            'loglevel',
            'ignoreChanges',
            'message',
            'bump',
            'noPrivate',
            'conventionalCommits',
            'conventionalGraduate',
            'changelogPreset',
        ],
        useSource: true,
    });
}
/**
 * Sort the command section of lerna.json.
 * 排序 lerna.json 的 command 區段。
 *
 * Sorts all command entries and then sorts the command keys
 * (publish, version, run, exec) in a predefined order.
 *
 * 排序所有命令項，然後按預定義順序排序命令鍵（publish、version、run、exec）。
 *
 * @template T - The command type / 命令類型
 * @param value - The command object to sort / 要排序的命令物件
 * @returns The sorted command object / 排序後的命令物件
 *
 * @example
 * ```typescript
 * const command = {
 *   version: { bump: 'minor' },
 *   publish: { concurrency: 4 },
 * };
 *
 * const sorted = sortLernaJsonCommand(command);
 * // Returns: { publish: { ... }, version: { ... }, ... }
 * ```
 */
function sortLernaJsonCommand(value) {
    /**
     * 由內而外排序：先將每個命令項（如 publish、version）內部的鍵排好，
     * 再排序 command 本身的鍵；順序顛倒雖不影響最終結果，但先處理內部可避免
     * 重複遍歷已排序的巢狀結構。
     *
     * Sort inside-out: each command entry (e.g. publish, version) is ordered first,
     * then the `command` keys themselves; reversing the steps would not change the
     * result, but sorting the nested part first avoids re-walking it afterwards.
     *
     * 邊界情況（Edge case）：`command` 在 ILernaJson 中是可選欄位，
     * 若傳入 undefined，`Object.values` 會拋出 TypeError；
     * 呼叫端需自行確認 command 已存在（或先補上空物件）。
     *
     * Edge case: `command` is optional in `ILernaJson`; passing `undefined` makes
     * `Object.values` throw a TypeError, so callers must ensure `command` exists
     * (or seed it with an empty object first).
     */
    Object.values(value).forEach(sortLernaJsonCommandEntry);
    return (0, sort_object_keys2_1.sortObjectKeys)(value, {
        keys: [
            'publish',
            'version',
            'run',
            'exec',
        ],
        useSource: true,
    });
}
/**
 * Sort a lerna.json configuration object.
 * 排序 lerna.json 配置物件。
 *
 * Sorts all sections of lerna.json including command entries,
 * command section, and top-level keys in a predefined order.
 *
 * 排序 lerna.json 的所有區段，包括命令項、命令區段和頂層鍵。
 *
 * @template T - The lerna.json type / lerna.json 類型
 * @param json - The lerna.json object to sort / 要排序的 lerna.json 物件
 * @returns The sorted lerna.json object / 排序後的 lerna.json 物件
 *
 * @example
 * ```typescript
 * const lernaConfig = {
 *   version: '1.0.0',
 *   packages: ['packages/*'],
 *   npmClient: 'yarn',
 *   command: {
 *     version: { bump: 'minor' },
 *   },
 * };
 *
 * const sorted = sortLernaJson(lernaConfig);
 * // Returns: { workspaces: undefined, packages: ['packages/*'], command: { ... }, ... }
 * ```
 */
function sortLernaJson(json) {
    /**
     * 先排序 command 區段再排頂層鍵，理由同 sortLernaJsonCommand 的由內而外原則。
     *
     * Sort the `command` section before the top-level keys, following the same
     * inside-out principle described in `sortLernaJsonCommand`.
     *
     * 邊界情況（Edge case）：`json.command` 為可選欄位，未定義時會在
     * sortLernaJsonCommand 內因 `Object.values(undefined)` 拋出 TypeError，
     * 因此不含 command 的 lerna.json 無法直接傳入。
     *
     * Edge case: `json.command` is optional; when it is missing,
     * `sortLernaJsonCommand` throws a TypeError because of `Object.values(undefined)`,
     * so a lerna.json without `command` cannot be passed in as-is.
     */
    sortLernaJsonCommand(json.command);
    /**
     * 頂層鍵採工作區設定優先的順序（workspaces → packages → command → … → version），
     * 讓 monorepo 讀者最先看到套件範圍；順序表未列出的鍵會被排到已知鍵之後，
     * 原有鍵值不會遺失。
     *
     * Top-level keys are ordered workspace-first (workspaces → packages → command
     * → … → version) so monorepo readers see the package scope first; keys missing
     * from the list land after the known ones and no existing key is dropped.
     *
     * useSource: true 讓排序結果直接回寫傳入的物件，回傳值即同一個實例。
     * `useSource: true` writes the sorted result back into the input, so the return
     * value is the very same instance.
     */
    return (0, sort_object_keys2_1.sortObjectKeys)(json, {
        keys: [
            'workspaces',
            'packages',
            'command',
            'npmClient',
            'useWorkspaces',
            'version',
        ],
        useSource: true,
    });
}
/**
 * Sort a lerna.json file and write it back.
 * 排序 lerna.json 檔案並寫回。
 *
 * Reads the lerna.json file, sorts its contents, and writes it back
 * to the same file path.
 *
 * 讀取 lerna.json 檔案，排序其內容，並寫回相同檔案路徑。
 *
 * @template T - The lerna.json type / lerna.json 類型
 * @param file - The path to the lerna.json file / lerna.json 檔案路徑
 * @returns void
 *
 * @example
 * ```typescript
 * // Sort lerna.json in the current directory
 * sortLernaJsonFile('./lerna.json');
 *
 * // Sort lerna.json in a specific directory
 * sortLernaJsonFile('/path/to/project/lerna.json');
 * ```
 */
function sortLernaJsonFile(file) {
    /**
     * 讀取 → 排序 → 寫回同一路徑，三步驟刻意同步執行：
     * 排序是純記憶體操作，而覆寫檔案屬於副作用，合併在單一呼叫可避免
     * 讀到一半被中斷而留下未排序或不完整的 lerna.json。
     *
     * Read → sort → write back to the same path, deliberately synchronous:
     * sorting itself is an in-memory operation while overwriting is the side effect,
     * so keeping them in one call avoids leaving a partially sorted or truncated
     * lerna.json behind if the process is interrupted mid-way.
     *
     * 邊界情況（Edge case）：此函式會直接覆寫原檔，且檔案不存在時
     * 取決於 readJSONSync 的行為（會拋出例外）。
     *
     * Edge case: the original file is overwritten in place; a missing file behaves
     * according to `readJSONSync` (it throws).
     */
    return (0, write_package_json_1.writePackageJSONSync)(file, sortLernaJson((0, fs_json_1.readJSONSync)(file)));
}
/**
 * 預設匯出（Default export）：與具名的 sortLernaJson 指向同一函式，
 * 讓 `import sortLernaJson from '...'` 與文件範例保持一致。
 *
 * Default export pointing at the same function as the named `sortLernaJson`,
 * so `import sortLernaJson from '...'` matches the documented examples.
 */
exports.default = sortLernaJson;
//# sourceMappingURL=index.js.map