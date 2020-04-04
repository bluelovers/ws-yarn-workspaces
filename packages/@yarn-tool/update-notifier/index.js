"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotifier = exports.notNpxMaybe = void 0;
const path_1 = require("path");
function notNpxMaybe(__dirname) {
    if (__dirname && /ypx_|_npx/i.test(__dirname)) {
        return false;
    }
    return !require('@yarn-tool/is-npx').isNpx({
        __dirname,
    });
}
exports.notNpxMaybe = notNpxMaybe;
function updateNotifier(__dirname, force, inputNoticeOptions) {
    if (Array.isArray(__dirname)) {
        __dirname = path_1.join(...__dirname);
    }
    if (force || (force == null) && notNpxMaybe(__dirname)) {
        let noticeOptions = {
            shouldNotifyInNpmScript: true,
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
exports.updateNotifier = updateNotifier;
exports.default = updateNotifier;
//# sourceMappingURL=index.js.map