"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printReport = void 0;
const core_1 = require("@yarn-tool/table/lib/core");
const index_1 = require("@yarn-tool/semver-diff/index");
const index_2 = require("debug-color2/index");
const formatVersion_1 = require("@yarn-tool/yarnlock-diff/lib/formatter/formatVersion");
function printReport(report, options) {
    var _a, _b;
    // @ts-ignore
    let chalk = (_a = options === null || options === void 0 ? void 0 : options.chalk) !== null && _a !== void 0 ? _a : index_2.chalkByConsoleMaybe(options === null || options === void 0 ? void 0 : options.console);
    const table = core_1.createDependencyTable({
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
        let lhs0 = formatVersion_1._formatVersion(from);
        let rhs0 = formatVersion_1._formatVersion(to);
        let lhs = chalk.red(lhs0);
        let rhs = chalk.yellow(index_1.colorizeDiff(lhs0, rhs0, options));
        let _arr;
        _arr = [chalk.yellow(path), lhs, ARROW, rhs];
        (_arr === null || _arr === void 0 ? void 0 : _arr.length) > 0 && (formatedDiff[path] = _arr);
    });
    table.push(...Object.values(formatedDiff));
    return _ok ? table.toString() : '';
}
exports.printReport = printReport;
//# sourceMappingURL=printReport.js.map