"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = exports.yarnLockDiff = void 0;
const diff_service_1 = require("yarn-lock-diff/lib/diff-service");
const formatter_1 = require("yarn-lock-diff/lib/formatter");
const debug_color2_1 = require("debug-color2");
const semver_diff_1 = require("@yarn-tool/semver-diff");
const core_1 = require("@yarn-tool/table/lib/core");
const { _formatVersion } = formatter_1.FormatterService;
function yarnLockDiff(yarnlock_old, yarnlock_new, options) {
    var _a;
    // @ts-ignore
    let chalk = (_a = options === null || options === void 0 ? void 0 : options.chalk) !== null && _a !== void 0 ? _a : debug_color2_1.chalkByConsoleMaybe(options === null || options === void 0 ? void 0 : options.console);
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
    diff_service_1.DiffService.buildDiff([yarnlock_old], [yarnlock_new])
        .map(function (diff) {
        let formatedDiff = {};
        const NONE = chalk.red('-');
        const ARROW = chalk.gray('→');
        diff
            .map(packageDiff => {
            const path = packageDiff.path.find(() => true);
            _ok = true;
            let _arr;
            switch (packageDiff.kind) {
                case 'A':
                    let diffArray = _diffArray(packageDiff, chalk);
                    _arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];
                    break;
                case 'D':
                    _arr = [chalk.red(path), chalk.red(_formatVersion(packageDiff.lhs)), ARROW, NONE];
                    break;
                case 'E':
                    let lhs0 = _formatVersion(packageDiff.lhs);
                    let rhs0 = _formatVersion(packageDiff.rhs);
                    let lhs = chalk.yellow(lhs0);
                    let rhs = chalk.yellow(semver_diff_1.colorizeDiff(lhs0, rhs0, options));
                    _arr = [chalk.yellow(path), lhs, ARROW, rhs];
                    break;
                case 'N':
                    _arr = [chalk.green(path), NONE, ARROW, chalk.green(_formatVersion(packageDiff.rhs))];
                    break;
            }
            _arr && (formatedDiff[path] = _arr);
        });
        table.push(...Object.values(formatedDiff));
    });
    return _ok ? table.toString() : '';
}
exports.yarnLockDiff = yarnLockDiff;
function _diffArray(array, chalk) {
    const item = array.item;
    switch (item.kind) {
        case "N":
            return [`[...]`, `[..., ${chalk.green(_formatVersion(item.rhs))}]`];
        case "D":
            return [`[..., ${chalk.red(_formatVersion(item.lhs))}]`, `[...]`];
        case "E":
            return [
                `[...], ${chalk.yellow(_formatVersion(item.lhs))}]`,
                `[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
            ];
        default:
            return [`[...]`, `[...]`];
    }
}
exports._diffArray = _diffArray;
//# sourceMappingURL=diff.js.map