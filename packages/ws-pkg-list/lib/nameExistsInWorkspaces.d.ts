/**
 * 檢查指定名稱是否已存在於目前工作區的套件清單中。
 * Check whether a given name already exists among the packages of the current workspace.
 *
 * @param name 要查核的套件名稱。The package name to look up.
 * @returns 命中的列（Row），找不到時為 undefined。The matched row, or `undefined` when not found.
 */
export declare function nameExistsInWorkspaces(name: string): import("./types").IListableRow;
