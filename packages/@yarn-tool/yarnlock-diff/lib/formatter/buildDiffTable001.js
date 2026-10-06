"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = buildDiffTable;
const tslib_1 = require("tslib");
const cli_table_1 = tslib_1.__importDefault(require("cli-table"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const formatVersion_1 = require("./formatVersion");
const diffArray001_1 = require("./diffArray001");
/**
 * 舊版表格渲染器：直接以 `cli-table` + `chalk` 產生三欄表格。
 * Legacy table renderer: builds a three-column table directly with `cli-table` + `chalk`.
 *
 * 已被 `./buildDiffTable002` 取代——本版本顏色硬編寫、不支援 `stripAnsi`，
 * 且使用到未列入 dependencies 的 `cli-table` / `chalk`。保留僅供比對與回溯。
 * Superseded by `./buildDiffTable002` — this version hardcodes colors, has no `stripAnsi`
 * support, and relies on `cli-table` / `chalk` which are not in dependencies. Kept only for
 * reference and backward comparison.
 *
 * @deprecated 請改用 `./buildDiffTable002` / Use `./buildDiffTable002` instead
 * @param diff `buildDiff` 產生的差異節點 / Diff nodes produced by `buildDiff`
 * @returns 三欄表格文字 / Three-column table text
 */
function buildDiffTable(diff) {
    const table = new cli_table_1.default({
        head: [
            chalk_1.default.blueBright("package name"),
            chalk_1.default.blueBright("old version(s)"),
            chalk_1.default.blueBright("new version(s)"),
        ],
        colWidths: [30, 50, 50],
    });
    /**
     * 以 `formatedDiff` 先收集再一次性 `push`，是為了讓同一個套件的多次變動
     * （例如同一列同時有新增與刪除）合併成一列，而不是印出多列相同套件名。
     * Collecting into `formatedDiff` before pushing once lets multiple changes to the same
     * package (for example an addition and a removal in one row) collapse into a single row
     * instead of repeating the package name.
     */
    const formatedDiff = {};
    diff.map(packageDiff => {
        const path = packageDiff.path.find(() => true);
        /**
         * 依 deep-diff 的 `kind` 分派：每一種變動在表格中的語意不同
         * （刪除顯示 `-`、新增顯示 `-` 於左欄、編輯則累加逗號）。
         * Dispatch on deep-diff's `kind`: each change means something different in the table
         * (a removal shows `-` on the right, an addition shows `-` on the left, an edit appends
         * with a comma).
         */
        switch (packageDiff.kind) {
            case "D" /* EnumKinds.DiffDeleted */:
                formatedDiff[path] = [
                    path,
                    chalk_1.default.red((0, formatVersion_1._formatVersion)(packageDiff.lhs)),
                    "-",
                ];
                break;
            case "N" /* EnumKinds.DiffNew */:
                formatedDiff[path] = [
                    path,
                    "-",
                    chalk_1.default.green((0, formatVersion_1._formatVersion)(packageDiff.rhs)),
                ];
                break;
            case "E" /* EnumKinds.DiffEdit */:
                const lhs = chalk_1.default.yellow((0, formatVersion_1._formatVersion)(packageDiff.lhs));
                const rhs = chalk_1.default.yellow((0, formatVersion_1._formatVersion)(packageDiff.rhs));
                if (formatedDiff[path]) {
                    formatedDiff[path] = [
                        path,
                        `${formatedDiff[path][1]}, ${lhs}`,
                        `${formatedDiff[path][2]}, ${rhs}`,
                    ];
                }
                else {
                    formatedDiff[path] = [path, lhs, rhs];
                }
                break;
            case "A" /* EnumKinds.DiffArray */:
                const diffArray = (0, diffArray001_1._diffArray)(packageDiff);
                formatedDiff[path] = [path, diffArray[0], diffArray[1]];
        }
    });
    Object.values(formatedDiff).forEach(tableRow => table.push(tableRow));
    return table.toString();
}
//# sourceMappingURL=buildDiffTable001.js.map