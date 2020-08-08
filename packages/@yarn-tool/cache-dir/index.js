"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYarnCacheDir = void 0;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = require("cross-spawn-extra");
function getYarnCacheDir() {
    try {
        let cp = cross_spawn_extra_1.sync('yarn', [
            'config',
            'current',
            '--json',
        ], {
            stripAnsi: true,
            env: process.env,
        });
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        if (data.tempFolder) {
            return upath2_1.normalize(data.tempFolder);
        }
    }
    catch (e) {
    }
    if (process.env.YARN_CACHE_FOLDER && fs_extra_1.pathExistsSync(process.env.YARN_CACHE_FOLDER)) {
        return upath2_1.normalize(process.env.YARN_CACHE_FOLDER);
    }
}
exports.getYarnCacheDir = getYarnCacheDir;
exports.default = getYarnCacheDir;
//# sourceMappingURL=index.js.map