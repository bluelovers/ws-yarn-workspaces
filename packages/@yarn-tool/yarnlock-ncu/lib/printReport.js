"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printReport = printReport;
const core_1 = require("@yarn-tool/table/lib/core");
const semver_diff_1 = require("@yarn-tool/semver-diff");
const debug_color2_1 = require("debug-color2");
const formatVersion_1 = require("@yarn-tool/yarnlock-diff/lib/formatter/formatVersion");
function printReport(report, options) {
    var _a, _b;
    // @ts-ignore
    let chalk = (_a = options === null || options === void 0 ? void 0 : options.chalk) !== null && _a !== void 0 ? _a : (0, debug_color2_1.chalkByConsoleMaybe)(options === null || options === void 0 ? void 0 : options.console);
    const table = (0, core_1.createDependencyTable)({
        colAligns: ['left', 'center', 'center', 'center'],
        head: [
            chalk.bold.reset('package'),
            chalk.bold.reset('old version'),
            '',
            chalk.bold.reset('new version'),
        ]
    });
    let formatedDiff = {};
    let _ok = false;
    const ARROW = chalk.gray('→');
    Object.entries((_b = report === null || report === void 0 ? void 0 : report.removed) !== null && _b !== void 0 ? _b : {})
        .forEach(([path, { from, to, }]) => {
        _ok = true;
        let lhs0 = (0, formatVersion_1._formatVersion)(from);
        let rhs0 = (0, formatVersion_1._formatVersion)(to);
        let lhs = chalk.red(lhs0);
        let rhs = chalk.yellow((0, semver_diff_1.colorizeDiff)(lhs0, rhs0, options));
        let _arr;
        _arr = [chalk.yellow(path), lhs, ARROW, rhs];
        (_arr === null || _arr === void 0 ? void 0 : _arr.length) > 0 && (formatedDiff[path] = _arr);
    });
    table.push(...Object.values(formatedDiff));
    return _ok ? table.toString() : '';
}
//# sourceMappingURL=printReport.js.map