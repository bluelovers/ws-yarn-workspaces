"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = void 0;
const cli_table_1 = __importDefault(require("cli-table"));
const chalk_1 = __importDefault(require("chalk"));
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
            case "D":
                formatedDiff[path] = [
                    path,
                    chalk_1.default.red(formatVersion_1._formatVersion(packageDiff.lhs)),
                    "-",
                ];
                break;
            case "N":
                formatedDiff[path] = [
                    path,
                    "-",
                    chalk_1.default.green(formatVersion_1._formatVersion(packageDiff.rhs)),
                ];
                break;
            case "E":
                const lhs = chalk_1.default.yellow(formatVersion_1._formatVersion(packageDiff.lhs));
                const rhs = chalk_1.default.yellow(formatVersion_1._formatVersion(packageDiff.rhs));
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
            case "A":
                const diffArray = diffArray001_1._diffArray(packageDiff);
                formatedDiff[path] = [path, diffArray[0], diffArray[1]];
        }
    });
    Object.values(formatedDiff).forEach(tableRow => table.push(tableRow));
    return table.toString();
}
exports.buildDiffTable = buildDiffTable;
//# sourceMappingURL=buildDiffTable001.js.map