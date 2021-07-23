"use strict";
/**
 * Created by user on 2018/11/28/028.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmVersion = void 0;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = (0, tslib_1.__importDefault)(require("cross-spawn-extra"));
const json5_1 = (0, tslib_1.__importDefault)(require("json5"));
function npmVersion(npmClient, cwd) {
    let args = [
        'version',
    ];
    npmClient = npmClient || 'npm';
    if (npmClient === 'yarn') {
        args = [
            'versions',
        ];
    }
    let cp = cross_spawn_extra_1.default.sync(npmClient, args, {
        cwd,
        stripAnsi: true,
    });
    if (cp.error) {
        throw cp.error;
    }
    let output = cp.stdout.toString()
        .replace(/^yarn versions [^\n]+$/gm, '')
        .replace(/^Done in [^\n]+$/gm, '')
        .replace(/^\s+|\s+$/g, '');
    let json = json5_1.default.parse(output);
    return json;
}
exports.npmVersion = npmVersion;
//# sourceMappingURL=index.js.map