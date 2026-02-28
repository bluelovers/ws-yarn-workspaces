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
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
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
export declare function sortLernaJsonCommandEntry<T extends Record<string, any>>(value: T): T;
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
export declare function sortLernaJsonCommand<T extends ILernaJson["command"]>(value: T): T;
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
export declare function sortLernaJson<T extends ILernaJson>(json: T): T;
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
export declare function sortLernaJsonFile<T extends ILernaJson>(file: string): void;
export default sortLernaJson;
