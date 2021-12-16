"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = void 0;
const tslib_1 = require("tslib");
const formatVersion_1 = require("./formatVersion");
const diffArray002_1 = require("./diffArray002");
const semver_diff_1 = require("@yarn-tool/semver-diff");
const core_1 = require("@yarn-tool/table/lib/core");
const debug_color2_1 = require("debug-color2");
const strip_ansi_1 = tslib_1.__importDefault(require("strip-ansi"));
function buildDiffTable(diff, options) {
    var _a;
    // @ts-ignore
    let chalk = (_a = options === null || options === void 0 ? void 0 : options.chalk) !== null && _a !== void 0 ? _a : (0, debug_color2_1.chalkByConsoleMaybe)(options === null || options === void 0 ? void 0 : options.console);
    let _ok = false;
    options = {
        ...options,
        chalk,
    };
    const table = (0, core_1.createDependencyTable)({
        colAligns: ['left', 'center', 'center', 'center'],
        head: [
            chalk.bold.reset('package name'),
            chalk.bold.reset('old version(s)'),
            '',
            chalk.bold.reset('new version(s)'),
        ]
    });
    let formatedDiff = {};
    const NONE = chalk.red('-');
    const ARROW = chalk.gray('→');
    diff
        .map(packageDiff => {
        //const path: string = packageDiff.path.find(() => true);
        const path = packageDiff.path[0];
        _ok = true;
        let _arr;
        switch (packageDiff.kind) {
            case "A" /* DiffArray */:
                let diffArray = (0, diffArray002_1._diffArray)(packageDiff, chalk);
                _arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];
                break;
            case "D" /* DiffDeleted */:
                _arr = [chalk.red(path), chalk.red((0, formatVersion_1._formatVersion)(packageDiff.lhs)), ARROW, NONE];
                break;
            case "E" /* DiffEdit */:
                let lhs0 = (0, formatVersion_1._formatVersion)(packageDiff.lhs);
                let rhs0 = (0, formatVersion_1._formatVersion)(packageDiff.rhs);
                let lhs = chalk.yellow(lhs0);
                let rhs = chalk.yellow((0, semver_diff_1.colorizeDiff)(lhs0, rhs0, options));
                _arr = [chalk.yellow(path), lhs, ARROW, rhs];
                break;
            case "N" /* DiffNew */:
                _arr = [chalk.green(path), NONE, ARROW, chalk.green((0, formatVersion_1._formatVersion)(packageDiff.rhs))];
                break;
        }
        _arr && (formatedDiff[path] = _arr);
    });
    table.push(...Object.values(formatedDiff));
    let output = _ok ? table.toString() : '';
    if ((options === null || options === void 0 ? void 0 : options.stripAnsi) === true) {
        output = (0, strip_ansi_1.default)(output);
    }
    return _ok ? output : '';
}
exports.buildDiffTable = buildDiffTable;
//# sourceMappingURL=buildDiffTable002.js.map