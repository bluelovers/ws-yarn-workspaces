"use strict";
/**
 * Workspace 版本修復工具
 * Workspace version fix utility
 *
 * 用於同步和修復 monorepo workspace 中的套件版本依賴
 * Used to sync and fix package version dependencies in monorepo workspaces
 *
 * 除了 plain 版本範圍，也處理 [Workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)：
 * 預設會把 `workspace:*` / `workspace:^` / `workspace:~` / `workspace:^1.2.3` 轉換為一般版本範圍，
 * 設定 `saveWorkspaceProtocol: true` 則保留既有的 `workspace:` 前綴。
 *
 * Besides plain version ranges this also handles the Workspace protocol: by default `workspace:*`,
 * `workspace:^`, `workspace:~` and `workspace:^1.2.3` are converted into plain version ranges, while
 * `saveWorkspaceProtocol: true` keeps an existing `workspace:` prefix in place.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WORKSPACE_PROTOCOL = void 0;
exports.getWorkspaceProtocol = getWorkspaceProtocol;
exports.isWorkspaceProtocol = isWorkspaceProtocol;
exports.parseWorkspaceProtocol = parseWorkspaceProtocol;
exports.isWorkspaceProtocolBareRange = isWorkspaceProtocolBareRange;
exports.workspaceProtocolToRange = workspaceProtocolToRange;
exports.rangeToWorkspaceProtocol = rangeToWorkspaceProtocol;
exports.handleOptionsFixWsVersions = handleOptionsFixWsVersions;
exports.handleRuntimeCache = handleRuntimeCache;
exports.fixPkgDepsVersionsCore = fixPkgDepsVersionsCore;
exports.fixWsVersionsCore = fixWsVersionsCore;
exports.fixWsVersions = fixWsVersions;
const deps_tree_1 = require("ws-pkg-list/lib/deps-tree");
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const util_1 = require("ws-pkg-list/lib/util");
const semver_simple_parse_1 = require("@lazy-node/semver-simple-parse");
const replaceSimpleSemVerVersion_1 = require("@lazy-node/semver-simple-parse/lib/replaceSimpleSemVerVersion");
/**
 * 預設 Workspace protocol 前綴
 * Default Workspace protocol prefix
 *
 * @see https://pnpm.io/workspaces#workspace-protocol-workspace
 */
exports.DEFAULT_WORKSPACE_PROTOCOL = 'workspace:';
/**
 * 取得目前使用的 Workspace protocol 前綴
 * Get the Workspace protocol prefix currently in use
 */
function getWorkspaceProtocol(opts) {
    var _a;
    return (_a = opts === null || opts === void 0 ? void 0 : opts.protocol) !== null && _a !== void 0 ? _a : exports.DEFAULT_WORKSPACE_PROTOCOL;
}
/**
 * 偵測版本字串是否為 Workspace protocol
 * Detect whether a version string uses the Workspace protocol
 */
function isWorkspaceProtocol(value, opts) {
    return typeof value === 'string' && value.startsWith(getWorkspaceProtocol(opts));
}
/**
 * 解析 Workspace protocol，非 Workspace protocol 時回傳 null
 * Parse a Workspace protocol; returns null when it is not a Workspace protocol
 */
function parseWorkspaceProtocol(value, opts) {
    const protocol = getWorkspaceProtocol(opts);
    if (isWorkspaceProtocol(value, opts)) {
        return {
            value,
            protocol,
            range: value.slice(protocol.length),
        };
    }
    return null;
}
/**
 * 判斷移除 protocol 後的範圍是否為 bare operator（`*` / `^` / `~` / 空字串）
 * Whether the range (after removing the protocol) is a bare operator (`*` / `^` / `~` / empty)
 */
function isWorkspaceProtocolBareRange(range) {
    return range === "" /* EnumSemverVersion.ANY */
        || range === "*" /* EnumSemverVersion.STAR */
        || range === "^" /* EnumOperatorBase.CARET */
        || range === "~" /* EnumOperatorBase.TILDE */;
}
/**
 * 將 Workspace protocol 轉換為一般版本範圍
 * Convert a Workspace protocol specifier into a plain version range
 *
 * @example
 * workspaceProtocolToRange('workspace:*', { version: '1.5.0' })       // '1.5.0'
 * workspaceProtocolToRange('workspace:~', { version: '1.5.0' })       // '~1.5.0'
 * workspaceProtocolToRange('workspace:^', { version: '1.5.0' })       // '^1.5.0'
 * workspaceProtocolToRange('workspace:^1.5.0', { version: '1.5.0' })  // '^1.5.0'
 *
 * 非 Workspace protocol 時原樣回傳。
 * Returned as-is when it is not a Workspace protocol.
 */
function workspaceProtocolToRange(value, opts) {
    const parsed = parseWorkspaceProtocol(value, opts);
    if (!parsed) {
        return value;
    }
    const { range } = parsed;
    const version = opts === null || opts === void 0 ? void 0 : opts.version;
    // `workspace:*` / `workspace:` → 套件實際版本
    // `workspace:*` / `workspace:` → the actual package version
    if (range === "" /* EnumSemverVersion.ANY */ || range === "*" /* EnumSemverVersion.STAR */) {
        return version !== null && version !== void 0 ? version : "*" /* EnumSemverVersion.STAR */;
    }
    // `workspace:^` / `workspace:~` → 保留 operator 並補上實際版本
    // `workspace:^` / `workspace:~` → keep the operator and append the actual version
    if (range === "^" /* EnumOperatorBase.CARET */ || range === "~" /* EnumOperatorBase.TILDE */) {
        return typeof version === 'string' ? range + version : value;
    }
    // `workspace:^1.5.0` → `^1.5.0`（版本是否同步由呼叫端決定）
    // `workspace:^1.5.0` → `^1.5.0` (whether the version is synced is up to the caller)
    return range;
}
/**
 * 將一般版本範圍轉回 Workspace protocol（逆向轉換），並可更換輸出的 protocol
 * Convert a plain version range back into a Workspace protocol specifier (reverse conversion),
 * with a swappable output protocol
 *
 * @example
 * rangeToWorkspaceProtocol('^1.5.0')                                   // 'workspace:^1.5.0'
 * rangeToWorkspaceProtocol('workspace:^1.5.0')                         // 'workspace:^1.5.0'（冪等）
 * rangeToWorkspaceProtocol('workspace:^1.5.0', { protocol: 'custom:' }) // 'custom:^1.5.0'
 *
 * 純版本範圍不會包含 `:`，因此既有的 protocol 前綴會被移除後再接上目標 protocol，
 * 除了避免重複疊加，也能藉由 `protocol` 更換輸出的 protocol。
 * A plain version range never contains `:`, so any existing protocol prefix is removed before the
 * target protocol is prepended; this avoids double-prefixing and lets `protocol` swap the output.
 */
function rangeToWorkspaceProtocol(value, opts) {
    const protocol = getWorkspaceProtocol(opts);
    const idx = value.indexOf(':');
    const range = idx === -1 ? value : value.slice(idx + 1);
    return protocol + range;
}
/**
 * 正規化 fix 系列函式的參數組合
 * Normalize the argument combinations accepted by the fix functions
 *
 * 支援三種呼叫型態：單一字串 `cwd`、單一選項物件，或「前項 + 附加選項」。
 * Supports three call shapes: a bare `cwd` string, a single options object, or
 * "first argument + extra options".
 *
 * @param {string | IOptionsFixWsVersions} [cwd] - 工作目錄字串或選項物件 / a cwd string or an options object
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，同名欄位以 `opts` 為準 / extra options; `opts` wins on same-named fields
 * @returns {IOptionsFixWsVersions} 正規化後的選項，保證不是 undefined / normalized options, never undefined
 *
 * @example
 * handleOptionsFixWsVersions('D:/ws')                                  // { cwd: 'D:/ws' }
 * handleOptionsFixWsVersions({ cwd: 'D:/ws' }, { saveWorkspaceProtocol: true })
 * // { cwd: 'D:/ws', saveWorkspaceProtocol: true }
 * handleOptionsFixWsVersions()                                          // {}
 */
function handleOptionsFixWsVersions(cwd, opts) {
    let options = {};
    if (typeof cwd === 'object') {
        options = cwd !== null && cwd !== void 0 ? cwd : {};
    }
    else if (typeof cwd === 'string' && cwd.length > 0) {
        options = {
            cwd,
        };
    }
    if (opts) {
        if (!options) {
            options = opts;
        }
        else {
            options = {
                ...options,
                ...opts,
            };
        }
    }
    return options !== null && options !== void 0 ? options : {};
}
/**
 * 處理執行時快取，初始化所有必要欄位
 * Process runtime cache, initialize all required fields
 *
 * @param {ICacheInput<R>} cache - 輸入快取物件 / Input cache object
 * @returns {Required<ICache<R>>} 完整快取物件 / Complete cache object
 */
function handleRuntimeCache(cache) {
    var _a, _b, _c, _d, _e, _f;
    var _g, _h, _j;
    // 將套件列表轉換為以名稱為鍵的映射 / Convert package list to name-keyed map
    (_a = cache.record) !== null && _a !== void 0 ? _a : (cache.record = (0, util_1.listableToRecord)(cache.listable));
    // 提取所有套件名稱 / Extract all package names
    (_b = cache.names) !== null && _b !== void 0 ? _b : (cache.names = Object.keys(cache.record));
    // 初始化結果映射 / Initialize result map
    (_c = cache.map) !== null && _c !== void 0 ? _c : (cache.map = {});
    // 初始化變更相關陣列 / Initialize change-related arrays
    (_d = (_g = cache.map).changed) !== null && _d !== void 0 ? _d : (_g.changed = []);
    (_e = (_h = cache.map).others) !== null && _e !== void 0 ? _e : (_h.others = []);
    (_f = (_j = cache.map).data) !== null && _f !== void 0 ? _f : (_j.data = {});
    return cache;
}
/**
 * 修復套件依賴版本的核心函數
 * Core function for fixing package dependency versions
 *
 * 將 workspace 內部套件的依賴版本更新為當前實際版本
 * Updates dependency versions of internal workspace packages to current actual versions
 *
 * `saveWorkspaceProtocol` 為 falsy 時（預設），`workspace:*` 等 Workspace protocol 會被轉換為一般版本範圍。
 * When `saveWorkspaceProtocol` is falsy (the default), Workspace protocols such as `workspace:*`
 * are converted into plain version ranges.
 *
 * 反之為 truthy 時只會「保留」既有的 `workspace:` 前綴；原本沒有 protocol 的 plain 引用不會被加上前綴。
 * When truthy it only *keeps* existing `workspace:` prefixes; plain references that never had a
 * protocol are never given one.
 *
 * @param {T} row - 套件 package.json 的依賴欄位（就地修改）/ Package.json dependency fields (mutated in place)
 * @param {ICacheInput<R>} cache - 快取資料 / Cache data
 * @param {IOptionsFixWsVersions} [opts] - 修復選項 / Fix options
 * @returns {Object} 修復結果；`changed` 僅在真的有改寫時才會被賦值，否則為 undefined
 *                   Fix result; `changed` is only assigned when something was actually rewritten,
 *                   otherwise it stays undefined
 */
function fixPkgDepsVersionsCore(row, cache, opts) {
    const options = handleOptionsFixWsVersions(opts);
    const { record, names, map } = handleRuntimeCache(cache);
    /** 標記是否有版本變更 / Flag indicating if any version changed */
    let changed;
    // 遍歷所有依賴欄位（dependencies, devDependencies, peerDependencies 等）
    // Iterate through all dependency fields
    types_1.packageJsonDependenciesFields
        .forEach(field => {
        if (row[field]) {
            names
                .forEach(name => {
                // 取得舊版本號 / Get old version
                const old = row[field][name];
                // 跳過未定義或萬用字元版本 / Skip undefined or wildcard versions
                if (typeof old !== 'undefined' && old !== "*" /* EnumSemverVersion.STAR */) {
                    // 取得套件當前版本 / Get package current version
                    const version = record[name].version;
                    /** Workspace protocol 的解析結果；非 Workspace protocol 時為 null / Parsed Workspace protocol, null when not a Workspace protocol */
                    const wsProtocol = isWorkspaceProtocol(old, options) ? parseWorkspaceProtocol(old, options) : null;
                    /** 實際要修復的版本範圍（已移除 workspace protocol）/ The range to fix (workspace protocol stripped) */
                    let range;
                    /** 若需保留 Workspace protocol，則記錄要加回的前綴 / The prefix to re-apply when the Workspace protocol must be kept */
                    let protocol;
                    if (wsProtocol) {
                        if (options.saveWorkspaceProtocol) {
                            /**
                             * bare operator（* / ^ / ~）沒有版本可修復，維持原樣
                             * A bare operator (* / ^ / ~) carries no version to fix, so keep it as-is
                             */
                            if (isWorkspaceProtocolBareRange(wsProtocol.range)) {
                                return;
                            }
                            range = wsProtocol.range;
                            protocol = wsProtocol.protocol;
                        }
                        else {
                            /**
                             * Workspace protocol → 一般版本範圍
                             */
                            range = workspaceProtocolToRange(old, {
                                protocol: wsProtocol.protocol,
                                version,
                            });
                        }
                    }
                    else {
                        range = old;
                    }
                    /** 解析版本範圍 */
                    const parsed = (0, semver_simple_parse_1.parseRange)(range);
                    /** 替換版本號並生成完整版本字串 */
                    const semver = (protocol !== null && protocol !== void 0 ? protocol : "" /* EnumSemverVersion.ANY */) + (0, replaceSimpleSemVerVersion_1.replaceSimpleSemVerVersion)(parsed[0], version).toFullString();
                    /** 如果版本有變更則更新 */
                    if (semver !== old) {
                        row[field][name] = semver;
                        changed = true;
                        map.data[name] = version;
                    }
                }
            });
        }
    });
    return {
        row,
        map,
        changed,
        cache: cache,
    };
}
/**
 * 修復 Workspace 版本的核心函數
 * Core function for fixing workspace versions
 *
 * 遍歷所有 workspace 套件並同步其內部依賴版本；未設定 `saveWorkspaceProtocol` 時，
 * `workspace:*` 等 Workspace protocol 也會一併轉換為一般版本範圍。
 * Iterates through all workspace packages and syncs their internal dependency versions; unless
 * `saveWorkspaceProtocol` is set, Workspace protocols such as `workspace:*` are also converted into
 * plain version ranges.
 *
 * @param {R[]} listable - 可列出的套件列表 / Listable packages list
 * @param {string | IOptionsFixWsVersions} [cwd] - 當前工作目錄字串，或直接傳入選項物件 / a cwd string, or the options object itself
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，`cwd` 為字串時才需要 / extra options, only needed when `cwd` is a string
 * @returns {Object} 修復結果：變更與未變更的套件，以及 `record` / `names` / `data` 映射
 *                   Fix result: changed and unchanged packages plus the `record` / `names` / `data` mappings
 *
 * @example
 * fixWsVersionsCore(listable, 'D:/ws');
 * fixWsVersionsCore(listable, { cwd: 'D:/ws', saveWorkspaceProtocol: true });
 */
function fixWsVersionsCore(listable, cwd, opts) {
    const options = handleOptionsFixWsVersions(cwd, opts);
    /** 初始化快取 / Initialize cache */
    const cache = handleRuntimeCache({
        listable,
    });
    /* 使用 reduce 遍歷所有套件並修復版本 / Use reduce to iterate all packages and fix versions */
    const result = listable.reduce((map, row) => {
        let changed;
        /** 執行版本修復並解構結果 / Execute version fix and destructure result */
        ({
            changed,
            map,
        } = fixPkgDepsVersionsCore(row, cache, options));
        /** 根據是否變更分類套件 / Categorize packages based on whether changed */
        if (changed) {
            map.changed.push(row);
        }
        else {
            map.others.push(row);
        }
        return map;
    }, cache.map);
    return {
        cwd: options.cwd,
        listable,
        record: cache.record,
        names: cache.names,
        ...result,
    };
}
/**
 * 修復 Workspace 版本的主要入口函數
 * Main entry function for fixing workspace versions
 *
 * 自動偵測 workspace 中的所有套件並同步版本
 * Automatically detects all packages in workspace and syncs versions
 *
 * @param {string | IOptionsFixWsVersions} [cwd] - 當前工作目錄字串或選項物件，預設 process.cwd()
 *                                                  a cwd string or an options object, defaults to process.cwd()
 * @param {IOptionsFixWsVersions} [opts] - 附加選項，會與 `cwd` 合併 / extra options, merged into `cwd`
 * @returns {Object} 修復結果 / Fix result
 *
 * @example
 * // 修復當前目錄的 workspace 版本
 * const result = fixWsVersions();
 * console.log(`Changed: ${result.changed.length} packages`);
 *
 * @example
 * // 保留 Workspace protocol
 * fixWsVersions(process.cwd(), { saveWorkspaceProtocol: true });
 */
function fixWsVersions(cwd, opts) {
    const options = handleOptionsFixWsVersions(cwd, opts);
    return fixWsVersionsCore((0, deps_tree_1.wsPkgDepsListable)(options.cwd), options);
}
/** 預設導出 / Default export */
exports.default = fixWsVersions;
//# sourceMappingURL=index.js.map