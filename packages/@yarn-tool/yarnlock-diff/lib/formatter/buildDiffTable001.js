"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = buildDiffTable;
const tslib_1 = require("tslib");
const cli_table_1 = tslib_1.__importDefault(require("cli-table"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const formatVersion_1 = require("./formatVersion");
const diffArray001_1 = require("./diffArray001");
/**
 * @deprecated
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
    const formatedDiff = {};
    diff.map(packageDiff => {
        const path = packageDiff.path.find(() => true);
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