"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYarnCachePath = findYarnCachePath;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = require("cross-spawn-extra");
function findYarnCachePath(cwd, processEnv = process.env) {
    try {
        let cp = (0, cross_spawn_extra_1.sync)('yarn', [
            'config',
            'current',
            '--json',
        ], {
            stripAnsi: true,
            env: processEnv,
            cwd,
        });
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        if (data.tempFolder) {
            return (0, upath2_1.normalize)(data.tempFolder);
        }
    }
    catch (e) {
    }
    if (processEnv.YARN_CACHE_FOLDER && (0, fs_extra_1.pathExistsSync)(processEnv.YARN_CACHE_FOLDER)) {
        return (0, upath2_1.normalize)(processEnv.YARN_CACHE_FOLDER);
    }
}
//# sourceMappingURL=findYarnCachePath.js.map