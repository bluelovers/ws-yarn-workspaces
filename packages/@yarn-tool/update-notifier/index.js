"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNpxMaybe = notNpxMaybe;
exports.updateNotifier = updateNotifier;
const tslib_1 = require("tslib");
const path_1 = require("path");
const ci_detect_1 = tslib_1.__importDefault(require("@npmcli/ci-detect"));
function notNpxMaybe(__dirname) {
    if (__dirname && /ypx_|_npx/i.test(__dirname)) {
        return false;
    }
    return !(0, ci_detect_1.default)() && !require('@yarn-tool/is-npx').isNpx({
        __dirname,
    });
}
function updateNotifier(__dirname, force, inputNoticeOptions) {
    if (Array.isArray(__dirname)) {
        __dirname = (0, path_1.join)(...__dirname);
    }
    if (force || (force == null) && notNpxMaybe(__dirname)) {
        let noticeOptions = {
            shouldNotifyInNpmScript: false,
            updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
            ...inputNoticeOptions,
        };
        const _updateNotifier = require('update-notifier');
        const pkg = require(require('path').join(__dirname, 'package.json'));
        const obj = _updateNotifier({
            ...noticeOptions,
            pkg,
        });
        obj.notify(noticeOptions);
        return obj;
    }
    return null;
}
exports.default = updateNotifier;
//# sourceMappingURL=index.js.map