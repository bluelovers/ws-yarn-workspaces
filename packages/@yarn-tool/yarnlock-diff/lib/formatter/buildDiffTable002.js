"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDiffTable = void 0;
const formatVersion_1 = require("./formatVersion");
const diffArray002_1 = require("./diffArray002");
const index_1 = require("@yarn-tool/semver-diff/index");
const core_1 = require("@yarn-tool/table/lib/core");
const index_2 = require("debug-color2/index");
const strip_ansi_1 = __importDefault(require("strip-ansi"));
function buildDiffTable(diff, options) {
    var _a;
    // @ts-ignore
    let chalk = (_a = options === null || options === void 0 ? void 0 : options.chalk) !== null && _a !== void 0 ? _a : index_2.chalkByConsoleMaybe(options === null || options === void 0 ? void 0 : options.console);
    let _ok = false;
    options = {
        ...options,
        chalk,
    };
    const table = core_1.createDependencyTable({
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
                let diffArray = diffArray002_1._diffArray(packageDiff, chalk);
                _arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];
                break;
            case "D" /* DiffDeleted */:
                _arr = [chalk.red(path), chalk.red(formatVersion_1._formatVersion(packageDiff.lhs)), ARROW, NONE];
                break;
            case "E" /* DiffEdit */:
                let lhs0 = formatVersion_1._formatVersion(packageDiff.lhs);
                let rhs0 = formatVersion_1._formatVersion(packageDiff.rhs);
                let lhs = chalk.yellow(lhs0);
                let rhs = chalk.yellow(index_1.colorizeDiff(lhs0, rhs0, options));
                _arr = [chalk.yellow(path), lhs, ARROW, rhs];
                break;
            case "N" /* DiffNew */:
                _arr = [chalk.green(path), NONE, ARROW, chalk.green(formatVersion_1._formatVersion(packageDiff.rhs))];
                break;
        }
        _arr && (formatedDiff[path] = _arr);
    });
    table.push(...Object.values(formatedDiff));
    let output = _ok ? table.toString() : '';
    if ((options === null || options === void 0 ? void 0 : options.stripAnsi) === true) {
        output = strip_ansi_1.default(output);
    }
    return _ok ? output : '';
}
exports.buildDiffTable = buildDiffTable;
//# sourceMappingURL=buildDiffTable002.js.map