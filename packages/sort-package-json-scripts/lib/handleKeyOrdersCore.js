"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyOrdersCore = handleKeyOrdersCore;
/**
 * 處理腳本鍵值順序的核心函式
 * Core function for handling script key ordering
 *
 * 此函式負責將腳本名稱按照 npm 生命週期順序進行排序和分組。
 * 排序邏輯：
 * 1. 首先檢查完整名稱是否為 npm 內建腳本
 * 2. 接著檢查去除前綴（如 pre/post）的名稱是否為內建腳本
 * 3. 然後檢查是否為其他腳本（otherScriptNames）
 * 4. 最後處理帶有前綴的腳本（如 prepublish、postinstall 等）
 *
 * 排序結果會確保相關的腳本（pretest、test、posttest）按順序排列。
 *
 * @param names - 要排序的腳本名稱陣列
 * @param opts - 排序選項，包含 otherScriptNames、defaultNpmScriptsOrder、omitKeyFn、sortKeyFn
 * @returns 排序後的腳本名稱陣列
 *
 * @example
 * handleKeyOrdersCore(['test', 'pretest', 'posttest', 'build'], opts)
 * // 返回: ['pretest', 'test', 'posttest', 'build']
 */
function handleKeyOrdersCore(names, { otherScriptNames, defaultNpmScriptsOrder, omitKeyFn, sortKeyFn, }) {
    /**
     * 可前綴化的鍵集合 - 用於追蹤哪些鍵需要有 pre/post 變體
     * Set of prefixable keys - tracks which keys need pre/post variants
     *
     * 例如：如果有 'test' 腳本，則 'pretest' 和 'posttest' 會被視為可前綴化
     */
    const prefixable = new Set();
    /**
     * 鍵值對應表 - 將基礎鍵映射到所有相關的完整腳本名稱
     * Key mapping - maps base key to all related full script names
     *
     * keymap['test'] = ['test', 'pretest', 'posttest']
     */
    const keymap = {};
    /**
     * 將腳本名稱添加到 prefixable 清單和對應列表
     * Add script name to prefixable list and corresponding list
     *
     * 此函式執行兩個操作：
     * 1. 將 key 註冊到 keymap 中，建立 key -> name 的映射關係
     * 2. 將 value 添加到 prefixable 集合和目標列表中
     *
     * @param value - 要添加的值（通常是鍵或完整名稱）
     * @param params - 包含 key、omitted、name、list 的參數物件
     */
    const addToPrefixable1 = (value, { key, omitted, name, list, }) => {
        var _a;
        /**
         * 將腳本名稱添加到 keymap 中
         * Add script name to keymap
         *
         * 建立 key 到所有相關名稱的映射
         * 例如：keymap['test'] = ['test', 'pretest', 'posttest']
         */
        keymap[key] = ((_a = keymap[key]) !== null && _a !== void 0 ? _a : []);
        keymap[key].push(name);
        /**
         * 將值添加到可前綴化集合和目標列表
         * Add value to prefixable set and target list
         */
        prefixable.add(value);
        list.push(value);
    };
    /**
     * 對腳本名稱進行分類和初始排序
     * Classify and initial sort script names
     *
     * 此 reduce 區塊會遍历每個腳本名稱，将其分類到對應的列表中：
     * 1. 先用 sortKeyFn 對名稱進行初步排序
     * 2. 使用 omitKeyFn 提取 key（基礎鍵）和 omitted（去除前綴的鍵）
     * 3. 根據優先級判斷應該放入 list1（一般腳本）還是 list2（NPM 生命週期腳本）
     *
     * 分類優先級（從高到低）：
     * 1. 完整名稱是 NPM 內建腳本 → list2
     * 2. key 是 NPM 內建腳本 → list2
     * 3. omitted 是 NPM 內建腳本 → list2
     * 4. 完整名稱是其他腳本 → list1
     * 5. key 是其他腳本 → list1
     * 6. omitted 是其他腳本或 key !== omitted → list1
     * 7. 名稱與 key 不同 → list1
     * 8. 其餘 → list1
     */
    const keys = names
        .sort(sortKeyFn)
        .reduce((a, name) => {
        /**
         * 使用 omitKeyFn 提取基礎鍵和前綴資訊
         * Use omitKeyFn to extract base key and prefix info
         *
         * omitKey 返回物件：
         * - key: 完整名稱的第一個區段（如 'pretest' -> 'test'）
         * - omitted: 去除 pre/post 前綴的基礎鍵（如 'pretest' -> 'test'）
         * - name: 原始腳本名稱
         */
        const { key, omitted } = omitKeyFn(name);
        /**
         * 優先級 1：完整名稱是 NPM 生命週期腳本
         * Priority 1: Full name is NPM lifecycle script
         */
        if (defaultNpmScriptsOrder.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        /**
         * 優先級 2：基礎鍵是 NPM 生命週期腳本
         * Priority 2: Base key is NPM lifecycle script
         *
         * 例如 'pretest' 的 key 是 'test'，如果 'test' 是生命週期腳本
         */
        else if (defaultNpmScriptsOrder.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        /**
         * 優先級 3：去除前綴的鍵是 NPM 生命週期腳本
         * Priority 3: De-prefixed key is NPM lifecycle script
         *
         * 例如 'pretest' 的 omitted 是 'test'
         */
        else if (defaultNpmScriptsOrder.has(omitted)) {
            addToPrefixable1(omitted, {
                key,
                omitted,
                name,
                list: a.list2,
            });
        }
        /**
         * 優先級 4：完整名稱是其他腳本（otherScriptNames）
         * Priority 4: Full name is other script (otherScriptNames)
         */
        else if (otherScriptNames.has(name)) {
            addToPrefixable1(name, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        /**
         * 優先級 5：基礎鍵是其他腳本
         * Priority 5: Base key is other script
         */
        else if (otherScriptNames.has(key)) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        /**
         * 優先級 6：去除前綴的鍵是其他腳本，或 key 與 omitted 不同
         * Priority 6: De-prefixed key is other script, or key differs from omitted
         *
         * 这种情况表示腳本有前綴（如 pre/post），需要特別處理
         */
        else if (otherScriptNames.has(omitted) || key !== omitted) {
            addToPrefixable1(omitted, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        /**
         * 優先級 7：名稱與基礎鍵不同（表示有尾碼或其他修飾）
         * Priority 7: Name differs from base key (has suffix or modifier)
         *
         * 例如 'test:watch' 與 'test' 不同
         */
        else if (name !== key) {
            addToPrefixable1(key, {
                key,
                omitted,
                name,
                list: a.list1,
            });
        }
        /**
         * 優先級 8：其餘情況，直接加入一般腳本列表
         * Priority 8: Default case, add to regular scripts list
         */
        else {
            a.list1.push(name);
        }
        return a;
    }, {
        /**
         * 一般腳本列表
         * Regular scripts list
         *
         * 包含非 npm 生命週期的自訂腳本
         */
        list1: [],
        /**
         * NPM 生命週期腳本列表
         * NPM lifecycle scripts list
         *
         * 包含 npm 內建的生命週期腳本（如 test、build、publish 等）
         */
        list2: [],
    });
    /**
     * 生成最終排序順序
     * Generate final sorting order
     *
     * 排序邏輯：
     * 1. 先放入所有 npm 生命週期腳本的預設順序
     * 2. 然後按照以下順序為每個鍵生成最終順序：
     *    - pre{key} - 前置腳本
     *    - {key} - 基礎腳本
     *    - post{key} - 後置腳本
     *
     * 例如：pretest, test, posttest
     */
    const order = [
        ...defaultNpmScriptsOrder.values(),
        ...keys.list2,
        ...keys.list1,
        /**
         * 遍历合併後的順序，為每個鍵生成完整的排序結果
         * Iterate through merged order, generate complete sorting result for each key
         *
         * 對於每個鍵：
         * - 如果鍵是可前綴化的（prefixable），則生成 pre/key/post 序列
         * - 否則直接將鍵加入結果
         */
    ].reduce((order, key) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        /**
         * 檢查當前鍵是否需要前綴化
         * Check if current key needs prefixing
         *
         * 可前綴化表示存在對應的 preXXX 或 postXXX 腳本
         */
        if (prefixable.has(key)) {
            /**
             * 加入前置腳本 pre{key}
             * Add pre{key} prefix script
             */
            order.push(`pre${key}`);
            /**
             * 加入所有以 pre{key} 開頭的腳本（如 pretest:watch）
             * Add all scripts starting with pre{key} (e.g., pretest:watch)
             */
            order.push(...((_c = (_b = (_a = keymap[`pre${key}`]) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : []));
            /**
             * 加入基礎腳本 {key}
             * Add base script {key}
             */
            order.push(key);
            /**
             * 加入所有以 {key} 開頭的腳本（如 test:watch）
             * Add all scripts starting with {key} (e.g., test:watch)
             */
            order.push(...((_f = (_e = (_d = keymap[key]) === null || _d === void 0 ? void 0 : _d.sort) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : []));
            /**
             * 加入後置腳本 post{key}
             * Add post{key} suffix script
             */
            order.push(`post${key}`);
            /**
             * 加入所有以 post{key} 開頭的腳本（如 posttest:coverage）
             * Add all scripts starting with post{key} (e.g., posttest:coverage)
             */
            order.push(...((_j = (_h = (_g = keymap[`post${key}`]) === null || _g === void 0 ? void 0 : _g.sort) === null || _h === void 0 ? void 0 : _h.call(_g)) !== null && _j !== void 0 ? _j : []));
        }
        /**
         * 不需要前綴化，直接加入結果
         * No prefixing needed, add directly to result
         */
        else {
            order.push(key);
        }
        return order;
    }, []);
    return order;
}
exports.default = handleKeyOrdersCore;
//# sourceMappingURL=handleKeyOrdersCore.js.map